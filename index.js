const fs = require('fs')
const colors = require('colors')
const prompt = require('prompt')
const {exec} = require('child_process')
// const art = require('ascii-art')

const configs = ['config', 'config_']
const appdata = process.env.APPDATA + '\\.vimeworld\\'

process.stdout.write(
    String.fromCharCode(27) + "]0;" + 'VimeChanger' + String.fromCharCode(7)
);

prompt.start()
prompt.message = ''
prompt.delimiter = ' >>';

async function rename(number) {
    try {
        let second = configs[1];

        if (number == 2) {
            second = configs[0]
        }

        await fs.renameSync(appdata + second, 'C:\\Users\\root\\AppData\\Roaming\\.vimeworld\\config__')
        await fs.renameSync(appdata + configs[number - 1], 'C:\\Users\\root\\AppData\\Roaming\\.vimeworld\\config')
        await fs.renameSync(appdata + 'config__', 'C:\\Users\\root\\AppData\\Roaming\\.vimeworld\\config_')

        return true;
    } catch (e) {
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
                const values = line.split(':')
                if (values[0] === 'username') {
                    let username = values[1].trim()
                    if (username === '') {
                        username = 'Новый аккаунт'
                    }

                    console.log(`${i}) ${username}`.blue)
                }
            }
        } catch (e) {
            await fs.openSync(appdata + config, 'w')
            console.log(`${i}) Новый аккаунт`.cyan)
        }
    }
}

async function start() {
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

    if (selected < 1 || selected > 2) {
        console.log('Можно иметь одновременно лишь два аккаунта. Нарушаем?'.red)
        while (1) {
        }
    }

    const renamed = await rename(selected)
    if (renamed) {
        try {
            exec(appdata + 'vimeworld.exe')
            console.log('Запуск успешен'.green)
        } catch (e) {
            console.error(e)
            console.log('Запуск сломафся'.red)
        }
    } else {
        console.log('Переименование конфига сломалось, может быть VimeWorld уже запущен?'.red)
    }
}

start()