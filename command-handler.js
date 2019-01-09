const latinize = require('latinize')
const emoji = require('node-emoji')

module.exports = {
    config: {
        prefix: '!',
        argumentSeparator: " "
    },
    availableCommands: [
        {
            name: 'rt',
            description: 'convert text input to regional indicators',
            run: (words) => {
                let output = ''
                let numberNames = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
                
                for (let word of words) {
                    let parsed = latinize(word).match(/[A-Za-z0-9]+/g)

                    if (parsed) {
                        for (let group of parsed) {
                            for (let char of group) {
                                let number = parseInt(char, 10)
                                if (!isNaN(number)) {
                                    output += `:${numberNames[number]}: `
                                } else {
                                    output += emoji.get(`regional_indicator_${char.toLowerCase()}`)
                                }                            
                            }
                        }
                        
                        output += "   "
                    }
                }
                return output
            }
        }
    ],
    handleCommand(message) {
        let command = module.exports.availableCommands.find(cmd => message.startsWith(`${module.exports.config.prefix}${cmd.name}`))

        if (command) {
            let arguments = message.split(module.exports.config.argumentSeparator)

            arguments.shift()

            if (arguments.length > 0) {
                return command.run(arguments)
            }
        }

        return null
    }
}