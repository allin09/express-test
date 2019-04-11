import to from 'await-to-js'
import { logger } from 'lib'
import emoji from 'node-emoji'
import TelegramBot from 'node-telegram-bot-api'
import _ from 'lodash'

let bot
let options

const sendMessage = async (msg, chatId = '') => {
  if (!chatId) chatId = options.chatId
  if (_.isString(chatId)) chatId = chatId.split(',')

  msg = emoji.emojify(msg)

  for (let cid of chatId) {
    const [err] = await to(bot.sendMessage(cid, msg))
    if (err) {
      logger.error(err)
    }
  }

  return null
}

const init = (opts) => {
  options = opts
  const { token, polling } = options
  bot = new TelegramBot(token, {
    polling: polling
  })

  bot.on(`message`, async (data) => {
    logger.warn(`on message`, data)
  })
}

let myBot = {
  init,
  sendMessage
}

export default myBot
