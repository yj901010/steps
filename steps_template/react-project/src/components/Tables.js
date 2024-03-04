import { useEffect, useState } from "react";
import ProjectTables from "./ProjectTable";
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import axios from "../axios";


const Tables = () => {
  let user = JSON.parse(sessionStorage.getItem('user') || null);

  const [rf_members, setRfMembers] = useState([]);
  const [lf_members, setLfMembers] = useState([]);
  const [fr_members, setFrMembers] = useState([]);
  const [fl_members, setFlMembers] = useState([]);
  
    useEffect(() => {
      axios
        .post('/user/survey', { id: user.id })
        .then((res) => {

          console.log(res.data);
          let gyroRfData;
          let fsrRfData;
          const gyroRfDataTemp = res.data.gyroRfData;
          if(gyroRfDataTemp && gyroRfDataTemp.length >= 5){
              gyroRfData =  res.data.gyroRfData.slice(0, 5);
          }else{
              gyroRfData =  res.data.gyroRfData;
          }
          // const gyroLfData = res.data.gyroLfData.slice(0,5);

          const fsrRfDataTemp = res.data.fsrRfData;
          if(fsrRfDataTemp && fsrRfDataTemp.length >= 5){
            fsrRfData = res.data.fsrRfData.slice(0,5);
          }else{
            fsrRfData = res.data.fsrRfData;
              console.log(fsrRfData);
          }
          // const fsrLfData = res.data.fsrLfData.slice(0,5);

          setRfMembers(gyroRfData);
          // setLfMembers(gyroLfData);
          setFrMembers(fsrRfData);
          // setFlMembers(fsrLfData);
  
        })
        .catch((error) => {
          console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
        });
    }, []);

  return (
    <Row>

      <Col lg="12" style={{marginBottom: '30px'}}>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0" style={{ backgroundColor: '#0B0B3B', color: 'white', borderRadius:'5px'}}>
            <i className="bi bi-card-text me-2"> </i>
            오른발 압력 데이터
          </CardTitle>
          <CardBody className="">
            <Table bordered striped>
              <thead>
              <tr>
                <th>시각</th>
                {[...Array(16).keys()].map((index) => (
                  <th key={index}>key{index + 1}</th>
                ))}
              </tr>
              </thead>
              <tbody>
              {fr_members && fr_members.map((member, index) => (
                  <tr key={index}>
                      {member && member.press_value && (
                          <>
                              <th scope="row" style={{ width: '200px' }}>
                                  {new Date(member.created_at).toLocaleString('ko-KR', { hour12: false })}
                              </th>
                              {Array.isArray(member.press_value) ? (
                                  member.press_value.map((value, idx) => (
                                      <td key={idx}>{value}</td>
                                  ))
                              ) : (
                                  <td>{member.press_value !== undefined ? member.press_value : 'N/A'}</td>
                              )}
                          </>
                      )}
                  </tr>
              ))}

              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>

      <Col lg="12" style={{marginBottom: '30px'}}>
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0" style={{ backgroundColor: '#0B0B3B', color: 'white', borderRadius:'5px' }}>
            <i className="bi bi-card-text me-2"> </i>
            오른발 데이터
          </CardTitle>
          <CardBody className="">
            <Table bordered hover>
            <thead>
                <tr>
                <th >시각</th>
                  <th>자이로 x</th>
                  <th>자이로 y</th>
                  <th>자이로 z</th>
                  <th>acc x</th>
                  <th>acc y</th>
                  <th>acc z</th>
                </tr>
              </thead>
              <tbody>
              {rf_members && rf_members.map((member, index) => (
                  <tr key={index}>
                      <th scope="row" style={{ width: '200px' }}>
                          {new Date(member.created_at).toLocaleString('ko-KR', { hour12: false })}
                      </th>
                      <td>{member.gyro_x !== undefined ? member.gyro_x : '0'}</td>
                      <td>{member.gyro_y !== undefined ? member.gyro_y : '0'}</td>
                      <td>{member.gyro_z !== undefined ? member.gyro_z : '0'}</td>
                      <td>{member.acc_x !== undefined ? member.acc_x : '0'}</td>
                      <td>{member.acc_y !== undefined ? member.acc_y : '0'}</td>
                      <td>{member.acc_z !== undefined ? member.acc_z : '0'}</td>
                  </tr>
              ))}

              <tr>
              </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Tables;