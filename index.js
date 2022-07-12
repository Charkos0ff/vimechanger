const fs = require('fs')
const colors = require('colors')
const prompt = require('prompt')
const {exec} = require('child_process')

const configs = ['config', 'config_']
const appdata = process.env.APPDATA + '\\.vimeworld\\'

process.stdout.write(
    String.fromCharCode(27) + "]0;" + 'VimeChanger' + String.fromCharCode(7)
);

prompt.start({noHandleSIGINT: true})
prompt.message = ''
prompt.delimiter = ' >>'


async function rename(number) {
    try {
        let second = number == 2 ? configs[0] : configs[1];

        await fs.renameSync(appdata + second, appdata + 'config__')
        await fs.renameSync(appdata + configs[number - 1], appdata + 'config')
        await fs.renameSync(appdata + 'config__', appdata + 'config_')

        return true;
    } catch (e) {
        console.error(e)
        return false;
    }
}

async function getAccounts() {
    let i = 0;
    for (const config of configs) {
        i++
        try {
            const session = (await fs.readFileSync(appdata + config, 'utf8')).split('\n')

            for (const line of session) {
                const [key, value] = line.split(':')
                if (key === 'username') {
                    let username = value.trim()
                    if (!username)
                        username = 'Новый аккаунт'

                    console.log(`${i}) ${username}`.blue)
                }
            }
        } catch (e) {
            await fs.openSync(appdata + config, 'w')
            console.log(`${i}) Новый аккаунт`.cyan)
        }
    }
}

function sendFinalMessage(message) {
    console.log(message)
    console.log('\n\nВыход из программы: CTRL + C'.red)
    while (1) {
    }
}

(async () => {
    console.log(`  __   ___            ___ _                           
 \\ \\ / (_)_ __  ___ / __| |_  __ _ _ _  __ _ ___ _ _ 
  \\ V /| | '  \\/ -_) (__| ' \\/ _\` | ' \\/ _\` / -_) '_|
   \\_/ |_|_|_|_\\___|\\___|_||_\\__,_|_||_\\__, \\___|_|  
                                       |___/         \n`.green)
    await getAccounts()
    console.log('Если в списке нет одного из аккаунтов, просто введите 1 или 2'.bold)

    const selected = (await prompt.get({
        properties: {
            account: {
                description: colors.magenta("\nВведите номер аккаунта")
            }
        }
    }))['account']

    if (selected < 1 || selected > configs.length) sendFinalMessage('Можно иметь одновременно лишь два аккаунта. Нарушаем?'.red)


    if (await rename(selected)) {
        try {
            exec(appdata + 'vimeworld.exe')
            console.log('Запуск успешен'.green)
        } catch (e) {
            console.error(e)
            sendFinalMessage('Запуск сломался. Пожалуйста, сообщите об этом в тему на форуме, приложив скриншот данного окна'.red)
        }
    } else {
        sendFinalMessage('Переименование конфига сломалось. Может быть, VimeWorld уже запущен?'.red)
    }
})()