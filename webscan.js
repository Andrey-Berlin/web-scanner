





/*
 * cross-browser/cross-platform browser-based network scanner and local ip detector 

 кросс-браузерный/кроссплатформенный браузерный сетевой сканер и локальный IP-детектор
 
 * by samy kamkar 2020/11/07
 * https://samy.pl
 */

(function(window) {
//Функция (окно) объект DOM
//
    function clog(...args) {
    // Функция clog создана для сбора информаци работы остальной части кода в сети.
        console.log(...args)
        //alert (clog);
    }

    // 
    let scanned = {}
  
  scanned[ip] = epoch()
    // subnets to scan for - подсети для сканирования
 /*  let enter_ip = document.getElementById('enter_ip');
   let ip_diapozon =document.getElementById("ip_diapozon");
   let subnets;
   enter_ip.onclick = ip_ip;
   function ip_ip () {
    ip_diapozon = .value; */
   let port = prompt ("Введите порт:");
    let subnets = /*ip_diapozon;*/
    
    [prompt("ВВЕДИТЕ ДИАПАЗОН ip-адресов в формате: 255.255.255.0 - 255"),
       /*  '10.0.0.1',
          '10.0.0.138',
          '10.0.0.2',
          '10.0.1.1',
          '10.1.1.1',
          '10.1.10.1',
          '10.10.1.1',
          '10.90.90.90',
          '192.168.100.1',
          '192.168.*.1',
          '192.168.0.10',
          '192.168.0.100',
          '192.168.0.101',
          '192.168.0.227',
          '192.168.0.254',
          '192.168.0.3',
          '192.168.0.30',
          '192.168.0.50',
          '192.168.1.10',
          '192.168.1.100',
          '192.168.1.20',
          '192.168.1.200',
          '192.168.1.210',
          '192.168.1.254',
          '192.168.1.99',
          '192.168.10.10',
          '192.168.10.100',
          '192.168.10.50',
          '192.168.100.100',
          '192.168.123.254',
          '192.168.168.168',
          '192.168.2.254',
          '192.168.223.100',
          '192.168.254.254',
          '200.200.200.5',*/
    ]
   
//alert(subnets);
    let candidateKeys = ["address", "candidate", "component", "foundation", "port", "priority", "protocol", "relatedAddress", "relatedPort", "sdpMLineIndex", "sdpMid", "tcpType", "type", "usernameFragment"]

    // ascii to hex ascii в шестнадцатеричный
   /* function a2h(str) {
        let hex = []
        for (let n = 0; n < str.length; n++) {
            let hbyte = Number(str.charCodeAt(n)).toString(16)
            if (hbyte.length == 1)
                hbyte = "0" + hbyte
            hex.push(hbyte)
        }
        return hex.join('')
        alert(str);
    }*/

    // Connect the two peers. Normally you look for and connect to a remote
    // machine here, but we're just connecting two local objects, so we can
    // bypass that step.
    // Соединяем два пира.  Обычно вы ищете и подключаетесь к удаленному
     // машина здесь, но мы просто соединяем два локальных объекта, так что мы можем
     // пропустить этот шаг.
    window.connectPeers = async function(ip, success) {
        let localConnection = null // RTCPeerConnection for our "local" connection
         //RTCPeerConnection для нашего «локального» соединения
        let remoteConnection = null // RTCPeerConnection for the "remote"
        //RTCPeerConnection для «удаленки»
        let sendChannel = null // RTCDataChannel for the local (sender)
        // RTCDataChannel для локального (отправителя)
        let receiveChannel = null // RTCDataChannel for the remote (receiver)
        // RTCDataChannel для удаленного (приемника)

        // Handles clicks on the "Send" button by transmitting
        // a message to the remote peer.
        // Обрабатывает нажатия на кнопку "Отправить", передавая
         // сообщение удаленному партнеру.
        function sendMessage() {
            if (sendChannel)
                sendChannel.send('тест')
        }

        // Handle status changes on the local end of the data
        // channel this is the end doing the sending of data
        // in this example.
        // Обработка изменений состояния на локальном конце данных 
        // Канал Это конец, выполняющий отправку данных 
        // В этом примере.
        function handleSendChannelStatusChange(event) {
            clog('handleSendChannelStatusChange', sendChannel)
            if (sendChannel) {
                clog('sendChannel state: ' + sendChannel.readyState)
                if (sendChannel.readyState === 'open')
                    sendMessage()
            }
        }

        // Handle onmessage events for the receiving channel.
        // These are the data messages sent by the sending channel.
        // обрабатывать события OnMessage для принимающего канала. 
        // Это сообщения данных, отправляемые отправкой канала.
        let handleReceiveMessage = async function(event) {
            clog(`handleReceiveMessage: ${ip} ${event}: ${event.data}`)
            success(ip)
            clog(event.ice)
        }

        // Called when the connection opens and the data
        // channel is ready to be connected to the remote.
        // Вызывается, когда соединение открывается и данные
         // канал готов к подключению к удаленному.
        let receiveChannelCallback = async function(event) {
            clog(`receiveChannelCallback: ${event}`, event)
            receiveChannel = event.channel
            receiveChannel.onmessage = handleReceiveMessage
            receiveChannel.onopen = handleReceiveChannelStatusChange
            receiveChannel.onclose = handleReceiveChannelStatusChange
        }

        // Handle status changes on the receiver's channel.
        // Обработка изменений состояния на канале получателя.
        function handleReceiveChannelStatusChange(event) {
            clog(`handleReceiveChannelStatusChange`)
            if (receiveChannel)
                clog("Статус канала приема изменился на " + receiveChannel.readyState)
        }

        // Close the connection, including data channels if they're open
        // Also update the UI to reflect the disconnected status
        // Закрываем соединение, включая каналы данных, если они открыты
        // Также обновите пользовательский интерфейс, чтобы отразить статус отключения
        function disconnectPeers() {
            clog(`disconnectPeers`)
                // Close the RTCDataChannels if they're open
            if (sendChannel) sendChannel.close()
            if (receiveChannel) receiveChannel.close()

            // Close the RTCPeerConnections
            localConnection.close()
            remoteConnection.close()

            sendChannel = null
            receiveChannel = null
            localConnection = null
            remoteConnection = null
        }

        // Create the local connection and its event listeners
        // Создаем локальное соединение и его прослушиватели событий
        const config = {
            iceServers: [],
            iceTransportPolicy: 'all',
            iceCandidatePoolSize: 0
        }
        localConnection = new RTCPeerConnection(config)

        // Create the data channel and establish its event listeners
        // XXX is there an alternative of this for older browsers that doesn't require mic?
        // Создаем канал данных и устанавливаем его прослушиватели событий
         // XXX есть ли альтернатива этому для старых браузеров, не требующая микрофона?
        if (localConnection.createDataChannel) {
            sendChannel = localConnection.createDataChannel("sendChannel")
                //sendChannel.onopen = async function(e) { success(ip) }
            sendChannel.onopen = handleSendChannelStatusChange
            sendChannel.onclose = handleSendChannelStatusChange
        }

        // Create the remote connection and its event listeners
        // Создаем удаленное соединение и его прослушиватели событий
        remoteConnection = new RTCPeerConnection(config)
        remoteConnection.ondatachannel = receiveChannelCallback

        // generate onicecandidate function for local and remote connections
        // генерируем функцию onicecandidate для локальных и удаленных подключений
        let iceCan = function(con) {
            return function(e) {
                let ret = 0
                try {
                    if (e.candidate) {
                        let newcan = {}
                        for (let key of candidateKeys)
                            newcan[key] = e.candidate[key]
                        newcan.candidate = newcan.candidate.replaceAll(/[\w\-]+\.local|127\.0\.0\.1/g,  ip)
                        newcan.address = ip
                            clog('newcan', newcan)
                            clog(con)
                        ret = con.addIceCandidate(newcan)
                        return ret
                    }
                    ret = !e.candidate || con.addIceCandidate(e.candidate)
                } catch (e) { clog('err', e) }
                return ret
            }
        }

        // Set up the ICE candidates for the two peers
        // Настраиваем кандидатов ICE для двух пиров
        localConnection.onicecandidate = iceCan(remoteConnection)
        remoteConnection.onicecandidate = iceCan(localConnection)

        // Now create an offer to connect this starts the process
       // Теперь создадим предложение для подключения, это запустит процесс
        localConnection.createOffer()
            .then(offer => localConnection.setLocalDescription(offer))
            .then(() => remoteConnection.setRemoteDescription(localConnection.localDescription))
            .then(() => remoteConnection.createAnswer())
            .then(answer => remoteConnection.setLocalDescription(answer))
            .then(() => localConnection.setRemoteDescription(remoteConnection.localDescription))
            .catch(handleCreateDescriptionError)
    }

    // Handle errors attempting to create a description
    // this can happen both when creating an offer and when
    // creating an answer. In this simple example, we handle
    // both the same way.
    // Обработка ошибок при попытке создать описание
   // это может происходить как при создании предложения, так и при
     // создание ответа.  В этом простом примере мы обрабатываем
     // оба одинаково.
    function handleCreateDescriptionError(error) {
        clog("Не удалось создать предложение: " + error.toString())
    }

    // Handle successful addition of the ICE candidate
    // on the "local" end of the connection.
    // Обработка успешного добавления кандидата ICE
     // на "локальном" конце соединения.
    function handleLocalAddCandidateSuccess() {
        clog('handleLocalAddCandidateSuccess')
    }

    // Handle successful addition of the ICE candidate
    // on the "remote" end of the connection.
    // Обработка успешного добавления кандидата ICE
     // на «удаленном» конце соединения.
    function handleRemoteAddCandidateSuccess() {
        clog('handleRemoteAddCandidateSuccess')
    }

    // Handle an error that occurs during addition of ICE candidate.
    // Обработать ошибку, возникающую при добавлении ICE-кандидата.
    function handleAddCandidateError() {
        clog(`handleAddCandidateError - FAIL`)
    }


    // convert * in ips to 0..255
    //преобразовать * в ips в 0..255
    window.unroll_ips = function(ips, min, max) {
        let newips = []
     // convert single ip to array
     // преобразовать одиночный ip в массив
        if (typeof(ips) === 'string')
            ips = [ips]

        // flatten * (older Edge doesn't support flatMap)
        // сглаживание * (старый Edge не поддерживает flatMap)
        for (let ip of ips)
            newips = newips.concat(
                ip.indexOf('*') != -1 ? [...Array((max - (min || 0) || 256) - (min || 0)).keys()].map(i => ip.replace('*', (min || 0) + i)) :
                ip
            )
        return newips
    }

    // hit blocks of ips, timeout after ms
    // попали в блоки ips, тайм-аут после мс
    window.scanIps = async function(ips, conf, subnet) {
        if (!conf) conf = {}
        if (!conf.block) conf.block = 1
        if (conf.logger) conf.logger(`scanIps() started, subnet=${!!subnet}`)

        let liveIps = {}
        // scan blocks of IPs
        // сканируем блоки IP
        for (let i = 0; i < ips.length; i += conf.block)
            liveIps = Object.assign(liveIps, await scanIpsBlock(ips.slice(i, i + conf.block), conf, subnet))

        return liveIps
    }

    window.scanIpsBlock = async function(ips, conf, subnet) {
        if (!conf) conf = {}
        if (!conf.timeout) conf.timeout = 250
        if (conf.logger) conf.logger(`Сканируем ip - адрес: (${ips})`)
        let promises = {}
        let liveIps = {}
        let scans = []
        const controller = new AbortController()
        const { signal } = controller

        // this is built for high speed and about 200x faster than standard fetch
       // это построено для высокой скорости и примерно в 200 раз быстрее, чем стандартная выборка
        let fetchConf = {
            signal: signal,
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
            headers: {},
            redirect: 'manual', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        }

        // add ip to our live IPs
// добавляем ip к нашим живым IP
        let addLive = async function(lip, time) {
            liveIps[lip] = time
            if (conf.networkCallback)
                conf.networkCallback(lip)
            if (conf.logger)
                conf.logger(`<b>Найден живой ip - адрес: ${lip}</b> ${liveIps[lip]-scanned[lip]}мс (network Callback)`)

            // now validate which ips are actually local via webrtc
// теперь проверяем, какие ips на самом деле являются локальными через webrtc
            if (conf.rtc !== false)
                await connectPeers(lip, function(tip) {
                    if (conf.logger)
                        conf.logger(`<b><span style='color:tomato;'>Найден живой IP-адрес: ${tip} </span> (local Callback)</b>`)
                    if (conf.localCallback)
                        conf.localCallback(tip)
                    liveIps[tip] = 0
                })
        }

        // generate success/fail promises first to speed things up
// сначала создайте промисы об успехе/неуспехе, чтобы ускорить процесс
        for (let ip of ips)
            promises[ip] =
            function(e) {
                // if we didn't abort, this ip is live!
                // если мы не прервали, этот ip активен!
                if (e.name !== 'AbortError')
                    addLive(ip, epoch())
            }

        // stop all fetches after timeout
        // останавливаем все выборки по тайм-ауту
        let timer = setTimeout(function() {
            controller.abort()
        }, conf.timeout)

        // scan our ips
// сканируем наши ips
        for (let ip of ips) {
            // if we haven't scanned it yet
// если мы его еще не просканировали
            if (!scanned[ip]) {
                clog(epoch(), ip)
                scans.push(fetch(`//${ip}:${port}/samyscan`, fetchConf).catch(promises[ip]))
                scanned[ip] = epoch()
            }
        }

        // when everything's done scanning, get time in ms
// когда все закончит сканирование, получим время в мс
        await Promise.all(scans.map(p => p.catch(e => e))).then(v => {
            for (let [ip, end] of Object.entries(liveIps))
                if (liveIps[ip])
                    liveIps[ip] -= scanned[ip]
        })

        // end timer in case it wasn't already
// таймер окончания, если он еще не установлен
        clearTimeout(timer)

        // if we found subnets, let's scan them
// если мы нашли подсети, то просканируем их
        if (subnet)
            for (let net of Object.keys(liveIps)) {
                if (conf.subnetCallback)
                    conf.subnetCallback(net)
                if (conf.logger) conf.logger(`scanIps(${getSubnet(net)}, subnet=false) (subnetCallback called)`)
                Object.assign(liveIps, await scanIps(unroll_ips(getSubnet(net) + '*', 1, 254), conf))
            }

       //  return ip: time
// возвращаем ip: время
        return liveIps
    }

    // return time
// время возврата
    function epoch() {
        //return performance.now()
        //return performance.now()
        return new Date().getTime()
    }

    // return subnet from ip address
// возвращаем подсеть по ip адресу
    function getSubnet(ip) {
        return ip.substr(0, ip.indexOf('.', ip.indexOf('.', ip.indexOf('.') + 1) + 1) + 1);
    } 

    // scan for subnets, then scan discovered subnets for IPs
// сканируем подсети, затем сканируем обнаруженные подсети на наличие IP-адресов
    window.webScanAll = async function(nets, conf) {
        // XXX Chrome acting funky on https, need to investigate
// XXX Chrome ведет себя странно на https, необходимо разобраться

        if (location.protocol === 'https:' && !conf.noRedirect) {
            location.protocol = 'http:'
            return
        }

        let ips = {}
        if (!conf) conf = {}
        if (!nets) nets = subnets
        if (conf.logger) conf.logger(`webScanAll() started`)

        // scan possible networks
// сканируем возможные сети
        ips.network = await scanIps(unroll_ips(nets), conf, true)
        ips.local = Object.keys(ips.network).filter(ip => ips.network[ip] == 0)

        // no local ip? try once more
// нет локального ip?  Попробуйте еще раз
        if (!ips.local.length) {
            if (conf.logger) conf.logger('no local ips found, scanning once more')

            // delete old times
// удалить старые времена
            scanned = {}

            // scan once more
// сканируем еще раз
            ips.network = await scanIps(unroll_ips(nets), conf, true)
            ips.local = Object.keys(ips.network).filter(ip => ips.network[ip] == 0)
        }
        return ips
    }
})(window)


window.addEventListener('load', async function() {
        // logging function - функция регистрации
        let log = function(line) {
            console.log(line)
            document.getElementById('content').innerHTML += `<li>` + line + '\n' + `</li>`+ `<hr/>` ;
        }

        let ipsToScan = undefined
        let scan = await webScanAll(
            ipsToScan, /* array. if undefined, scan major subnet gateways, then scan live subnets. supports wildcards - массив.  если не определено, сканируйте основные шлюзы подсети, а затем сканируйте действующие подсети.  поддерживает подстановочные знаки*/
            {
                rtc: true, // use webrtc to detect local ips - используйте webrtc для определения локальных ips
                logger: log, // logger callback - обратный вызов регистратора
                localCallback: function(ip) {
                    console.log(`Живой ip - aдрес callback: ${ip}`)
                },
                networkCallback: function(ip) {
                    console.log(`IP-адрес сети callback: ${ip}`)
                },
            }
        )
        log(JSON.stringify(scan, null, 2))
        log(`<b><span style='color: tomato;'>Живой IP - адрес: ${scan.local.join(',')}</span></b>`)
    })