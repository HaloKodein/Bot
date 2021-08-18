import config from './config'
import Bot from './entities/Bot'

export const client = new Bot()

async function bootstrap() {
    await client.eventManager
        .handle()

    await client.commandManager
        .handle()
        
    await client.interactionCommandManager
        .handle()
    
    client.login(config.token)
}

bootstrap()
