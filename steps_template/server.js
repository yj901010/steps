const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const BluetoothSerialPort = require('bluetooth-serial-port');

const indexRouter = require('./routes');
const userRouter = require('./routes/user');

const path = require('path');
const cors = require('cors');

// BluetoothSerialPort 객체 생성
const bluetoothSerialPort = new BluetoothSerialPort.BluetoothSerialPort();
const address = '98:da:60:06:23:a2';  // HC-06 모듈의 MAC 주소로 수정

// 정적인 파일을 가져오기 위한 미들웨어
app.use(express.static(path.join(__dirname, 'react-project', 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'react-project', 'build', 'index.html'));
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/user', userRouter);

// Bluetooth 연결 코드
bluetoothSerialPort.findSerialPortChannel(address, function (channel) {
    bluetoothSerialPort.connect(address, channel, function () {
        console.log('Connected to HC-06');

        // 데이터 수신 이벤트 리스너
        bluetoothSerialPort.on('data', function(buffer) {
            const data = buffer.toString('utf-8');
            //console.log('Received:', data);
            // Emit the data to connected clients through the socket
            io.emit('bluetoothData', data);
        });
    });
});

// 연결 종료 이벤트 리스너
bluetoothSerialPort.on('closed', function() {
    console.log('Connection to HC-06 closed');
});

io.on('connection', (socket) => {
    console.log('A user connected to the socket.');

    socket.on('disconnect', () => {
        console.log('User disconnected from the socket.');
    });
});

app.set('port', process.env.PORT || 3001);

http.listen(app.get('port'), () => {
    console.log('Server is listening on port', app.get('port'));
});
