const BluetoothSerialPort = require('bluetooth-serial-port');

const address = '98:da:60:06:23:a2';  // HC-06 모듈의 MAC 주소로 수정
const channel = 1;  // HC-06 모듈의 채널로 수정
const bluetoothSerialPort = new BluetoothSerialPort.BluetoothSerialPort();

bluetoothSerialPort.findSerialPortChannel(address, function (channel) {
    bluetoothSerialPort.connect(address, channel, function () {
        console.log('Connected to HC-06');

        // 데이터 수신 이벤트 리스너
        bluetoothSerialPort.on('data', function(buffer) {
            const data = buffer.toString('utf-8');
            console.log('Received:', data);
            // 여기에서 필요한 작업 수행
        });
    });
});

// 연결 종료 이벤트 리스너
bluetoothSerialPort.on('closed', function() {
    console.log('Connection to HC-06 closed');
});