import { Container } from "@mui/material";

const Guide = () => {
  return (
      <div id='guide-container'>
        <h2 className="guide-title">포카포미 사용이 처음이세요?</h2>

      <ul>
        <li className='guide-content-title'>포토카드 교환에 대해서</li>
        <p className='guide-content-text'>
          1. 포토카드 교환이 너무 어려운 당신을 위한 서비스!
        </p>
        <p>
          2. 중복포카 비켜! 갈망포카 가지러 간다.
        </p>
        <hr/>
        <li className='guide-content-title'>게시글 작성 가이드</li>
        <p>
          1. 하자는 꼼꼼하게 설명해주세요.
        </p>
        <p>
          2. 사진은 사실적일수록 좋아요!
        </p>
        <hr/>
        <li className='guide-content-title'>거래 인증 가이드</li>
        <p>
          1. 포카포미는 개인의 부주의한 거래로 인한 손해를 책임지지 않습니다.
        </p>
        <p>
          2. 가짜 포토카드를 주의하세요.
        </p>
        <hr/>
        <li className='guide-content-title'>기타 유의사항</li>
        <p>
          1. 거래가 완료된 후에는 "거래완료" 버튼을 눌러주세요!
        </p>
        <p>
          2. 실시간 거래는 공공장소에서 진행하는 게 안전합니다.
        </p>
      </ul>
      </div>
  );
};

export default Guide;
