import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import PostureCorrectionVideo from "../components/PostureCorrectionVideo";
import bg1 from "../images/bg/card1.jpg";
import bg2 from "../images/bg/card2.jpg";
import bg3 from "../images/bg/card3.jpg";
import Blog from "../components/Blog";

const BlogData = [
  {
    image: bg1,
    title: "사용자 중심 인터페이스",
    description:
      "직관적인 ui/ux로 편의성을 고려해 사용자가 쉽게 이해하고 조작할 수 있도록 이용자 경험 중심의 인터페이스를 효과적으로 제공합니다."
  },
  {
    image: bg2,
    title: "데이터 확보/가공",
    description:
      "자이로 센서와 압력 센서를 통해 사용자의 걸음 가속도, 각속도, 압력값을 받아와서 보행 패턴을 분석해 근곡결계 불균형 개선에 도움을 줍니다."
  },
  {
    image: bg3,
    title: "서비스 목표",
    description:
      "허리디스크의 발병률 상승에 대응, 정확한 자세교정 및 걸음걸이 교정 서비스를 제공하여 건강한 라이프스타일을 효과적으로 유지합니다."
  }
];

const About = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));


  return (
    <Row>
      <Col className="text-center">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0"  style={{ backgroundColor: "aliceblue" }} >
            <i className="bi bi-bell me-2"> </i>
            {user?
              (<h5><strong>{user.name}님 환영합니다:)</strong></h5>):
              (<h5><strong>환영합니다!</strong></h5>)}

          </CardTitle>
          <CardBody className="p-4 " >
            <Row className="justify-content-center">
              <Col lg="8" >
                <h4 className="mt-4"><strong>걸음 각속도 기반 자세교정 시스템</strong></h4>
                <br/>
                <h6 className=" mb-4" style={{ fontSize: "20px" }}>
                이 서비스는 가속도계와 자이로스코프 센서를 통합하여
                <br/> 사용자의 자세를 실시간으로 감지하고,
                
                압력센서를 활용하여 힘의 균형을 측정함으로써 개인 맞춤형 자세 교정을 제공하는 헬스케어 서비스입니다.
                </h6>
                <br/>
                <PostureCorrectionVideo />
                <br />

              </Col>
            </Row>
            <br/>
            <div className="text-center">
              <h5 className="mb-3"><strong>서비스 소개</strong></h5>
              <Row className="justify-content-center">
                {BlogData.map((blg, index) => (
                  <Col sm="6" lg="6" xl="3" key={index}>
                    <Blog
                      image={blg.image}
                      title={<strong>{blg.title}</strong>}
                      subtitle={blg.subtitle}
                      text={blg.description}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};


export default About;
