/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var WebDriverAgent = require("./webdriver-agent.js").WebDriverAgent;

var agentTypes = exports.agentTypes = {
    WEBDRIVER: "webdriver"
};

var WEBDRIVER_HEARTBEAT_TIME = 30*1000; // 30s

var AgentPool = Object.create(Object, {
    init: {
        value: function() {
            this.agents = {};
            this.agentTypes = agentTypes;
            return this;
        }
    },
    
    agents: {
        value: null
    },

    /**
     * Attach socket.io port so that the agent-pool is able to communicate
     * with the control-room.
     * If we wouldn't allow setting it after initialization the server
     * startup code would get really awkward.
     */
    io: {
        value: null
    },
    
    /**
     * Adding a new agent to the pool.
     * 
     * Through the config-object we can define how the Agent should
     * be instantiated, e.g.:
     * 
     * config = {
     *     type: 1,
     *     socket: myWebSocket // ref to websocket
     * }
     *
     * @param {Object} capabilities of the new agent
     * @param {Object} configuration object of this agent (keys: type, socket|baseUrl)
     * @return {agent} The created agent object
     */
    addAgent: {
        value: function(caps, config) {
            var agent;
            var self = this;
            if(config.type == this.agentTypes.WEBDRIVER) {
                agent = Object.create(WebDriverAgent).init(config.url, this.io);
                agent.type = config.type;
                this.agents[agent.friendlyName] = agent;
                // removing a webdriver agent when it is not available anymore
                var heartbeatInterval = setInterval(function(){
                    agent.isAvailable(function(success){
                        if(!success) {
                            clearInterval(heartbeatInterval);
                            self.removeAgent(agent.id);
                        }
                    });
                }, WEBDRIVER_HEARTBEAT_TIME);
            }
            return agent;
        }
    },
    
    /**
     * Removing an agent from the pool.
     *
     * @param {Number} id of the agent
     * @return void
     */
    removeAgent: {
        value: function(agentId) {
            var agent = this.agents[agentId];
            if(agent) {
                this.io.sockets.in("drivers").emit("agentDisconnected", agentId);
            }
            delete this.agents[agentId];
        }
    },
    
    /**
     * Receiving a list of agents of this pool.
     *
     * @param {Boolean} [isBusy] include the busy agents (true) or the non-busy (false)? (undefined == all agents)
     * @return {Array} List of agents
     */
    getAgents: {
        value: function(isBusy) {
            var agentList = [];
            var agent;
            for(var i in this.agents) {
                agent = this.agents[i];
                if (isBusy == undefined) {
                    agentList.push(agent.getSummary());
                }
                else if(!!isBusy === agent.isBusy) { // TODO: using stringToBoolean
                    agentList.push(agent.getSummary());
                }
            }
            return agentList;
        }
    },
    
    /**
     * Getting an agent by its capabilities.
     *
     * @param {Object} desired capabilities of the agent
     * @return {Agent}
     */
    getAgentByCaps: {
        value: function(desiredCaps) {
            // TODO: implement a more sophisticated selection process
            return this.agents[desiredCaps.id];
        }
    },
    
    /**
     * Getting an agent by its id.
     *
     * @param {Number} id of the agent
     * @return {Agent|undefined}
     */
    getAgentById: {
        value: function(agentId) {
            return this.agents[agentId];
        }
    }
});

exports.agentPool = Object.create(AgentPool).init();