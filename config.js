/// JIRA project template:
/// {
///     name: <project key>
///     channelId: <id of channel to send notifications>
/// } 

module.exports = {
    jira: {
        url: '', // Jira http/https address without slash at the end
        projects: [
            {
                name: 'TEST', // Jira project key
                channelId: '' // Discord channel ID to send notifications
            }
        ]
    },
    bot: {
        token: '', // Discord bot API token
        port: 8123, // Bot server port to listen on
        ip: '0.0.0.0' // Bot server address
    }
    
}