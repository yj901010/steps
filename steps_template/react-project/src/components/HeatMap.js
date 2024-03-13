import { Col, Row, Table, Card, CardTitle, CardBody } from "reactstrap";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const HeatMap = () => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [fsrArray, setFsrArray] = useState([]);

    useEffect(() => {
        // 소켓 이벤트 리스너 등록
        socket.on('bluetoothData', (data) => {
            // 데이터 형식을 확인하고 적절히 파싱하여 2D 배열로 변환
            const parsedData = parseBluetoothData(data);
            setHeatmapData(parsedData);
        });

        return () => {
            // 컴포넌트 언마운트 시 소켓 이벤트 리스너 제거
            socket.off('bluetoothData');
        };
    }, []);

    const parseBluetoothData = (data) => {
        // 문자열을 ','를 기준으로 분할하고 2D 배열로 변환
        const Array = data.split(',').map(Number);
        const dataArray = Array.slice(0, 16);
        setFsrArray(dataArray);

        // 데이터를 주어진 형태에 맞게 재구성
        const rows = 6;
        const cols = 3;
        const parsedData = [];
        for (let i = 0; i < rows; i++) {
            let startIdx, endIdx;

            if (i === 0) {
                startIdx = 0;
                endIdx = 2;
            } else if (i === 1) {
                startIdx = 2;
                endIdx = 5;
            } else if (i === 2) {
                startIdx = 5;
                endIdx = 8;
            } else if (i === 3) {
                startIdx = 8;
                endIdx = 11;
            } else if (i === 4) {
                startIdx = 11;
                endIdx = 14;
            } else if (i === 5) {
                startIdx = 14;
                endIdx = 16;
            }
            
            parsedData.push(dataArray.slice(startIdx, endIdx));
          }
          
        return parsedData;
    };
    
    return (
      <div>
        
      <div className="heatmap-container" style={{ backgroundImage: 'url("../free-icon-soles-3066981.png")', backgroundSize: '15% 100%', backgroundRepeat: 'no-repeat'  }}>

            {heatmapData.map((row, rowIndex) => (
              <div key={rowIndex} className="heatmap-row" style={{ display: 'flex', width: '250px' }}>
                    {row.map((value, colIndex) => (
                        <div key={colIndex} className="heatmap-cell">
                            <Footprint value={value} />
                        </div>
                    ))}
                </div>
            ))}
            </div>

      </div>
    );
};

const Footprint = ({ value }) => {
    const fillColor = `rgba(255, 0, 0, ${value / 100})`;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="70" height="70">
            <circle cx="50" cy="50" r="40" fill={fillColor} />
        </svg>
    );
};

export default HeatMap;