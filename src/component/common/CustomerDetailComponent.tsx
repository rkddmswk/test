import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useDaumPostcodePopup } from "react-daum-postcode";
import { postcodeScriptUrl } from 'react-daum-postcode/lib/loadPostcode';
//import { postcodeScriptUrl } from "react-daum-postcode/lib/loadPostcode";

interface CustomerComponentDetail{
    calCodeData:CustomerDetailInfo;
    setCalCodeData: React.Dispatch<React.SetStateAction<CustomerDetailInfo>>;
    data:any[];
    setData:React.Dispatch<React.SetStateAction<any>>;
 }

 interface CustomerDetailInfo{
  custCd:string;		
  custNm:string;				
  regionCd:string;				
  calCd:string;				
  shipmentYn:string;				
  telNo:string;
  faxNo:string;
  postNo:string;
  addStd:string;
  addDtl:string;
  manNm:string;
  manTelNo:string;
  invoiceMail:string;
}

const StyleBox = styled.div`
    .custom-detail{
        width:748px;
        height:650px;
        //background-color:gray;
        float:left;
        padding:10px;
        //border:1px solid black;
    }
    .custom-button{
        width:100%;
        height:24px;
        //background-color:black;
        position:relative;
        margin-bottom:10px;
      }
    .custom-button p{
        float:left;
        font-weight:bold;
    }
    .custom-button img{
        width:20px;
        height:20px;
        position:absolute;
        right:15px;
        top:5px;
    }  
    .custom-button button:nth-child(2) img{
        width:20px;
        height:20px;
        background-color:black
        position:absolute;
        right:60px; 
    }
    .detail-wrap{
        width:100%;
        height:606px;
        //background-color:white;
        border:1px solid black;
      }
    .detail-list{
        width:100%;
        height:46.615px;
        padding-top:8.305px;
        //padding-top:23.307px;
        // padding:10px;
     
    }

    .detail-list p{
        width:130px;
        height:25px;
        //background-color:pink;
        float:left;
        margin-right:40px;
        text-align:right;
        line-height:25px;
    }

    .detail-list select:hover{
        border:2px solid black;
        cursor:pointer;
    }
    .p1{
        //letter-spacing:10px;
        text-align:left;
    }
    .p4{
        // letter-spacing:17px;
        text-align:left;
    }
    .detail-list input{
        width:300px;
        height:25px;
        //background-color:yellow;
        float:left;
        border:1px solid gray;
        padding:5px;
    }
    .detail-list input:hover{
        border:2px solid black;
    }
    .regionCd , .calCd{
        padding-left:5px;
    }
    .detail-box{
        width:300px;
        height:30px;
        float:left;
        border:1px solid gray;
        position:relative;
    }

    .input-button{
        width:20px;
        height:20px;  
        position:relative;
        // position:absolute;
        right:30px;
        top:5px;
    }
    
  .label-wrap{
    width:300px;
    height:30px;
    float:left;
    display: flex;
    align-items:center;
  }
    .label-wrap input[type="radio"] { 
        width:20px;
        height:20px;
        display:flex;
        cursor:pointer;
        margin-left:10px;
    }
    .shipmentYn{
        margin-right:5px;
    }
    .label-wrap input[type="radio"]:nth-child(2) { 
        margin-left:50px;
    }     
    .label-wrap input{
        width:150px;
    }
    .select-test{
        letter-spacing:30px;
    }
    .regionCd{
        width:300px;
        height:25px;
        border:1px solid gray;
    }
    .calCd{
        width:300px;
        height:25px;
        border:1px solid gray;
    }
    .checkbox{
        cursor:pointer;
    }
    #custCd{
        pointer-events: none;
    }
`

const CustomerDetail = ({calCodeData, setCalCodeData, data, setData}:CustomerComponentDetail) => {


//고객사명
function checkReg(event:{target:any;}){
event.target.value = event.target.value.replace(/[^ㄱ-ㅎ가-힣a-zA-Z\s]/g, "");
}

//전화번호
function autoHyphen(event: { target: any; }){
event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/(\d{3})(\d{4})(\d)/, "$1-$2-$3");
}

//팩스번호
function autoFax(event:{target:any;}){
event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/(\d{2})(\d{4})(\d{4})/,'$1-$2-$3');
}

// 다음 우편번호 url
// useDaumPostcodePopup(postcodeScriptUrl)을 호출하여 open이라는 함수를 생성한다.
//const open = useDaumPostcodePopup(postcodeScriptUrl);

// 클릭 시 수행될 팝업 생성 함수
// 주소검색이 완료되고, 결과 주소를 클릭 시 해당 함수 실행 
// open함수로 주소 검색팝업 열고 검색완료시 handleComplete실행
// const handleClick = () => {
//   open({onComplete: handleComplete}); 
// }

// const handleComplete = (data: any) => {
//   console.log(data);
//   // postNo: 우편번호 id값, addStd: 기본주소 id값
//   // 현재 calCodeData 상태를 업데이트
//   // 도로명주소/지번주소 조건문
//   if(data.userSelectedType === 'R'){
//     console.log(data.userSelectedType);
//     setCalCodeData({...calCodeData, postNo: data.zonecode, addStd: data.roadAddress});
//   }else{
//     console.log(data.userSelectedType);
//   setCalCodeData({...calCodeData, postNo: data.zonecode, addStd: data.jibunAddress});
//   }
// }


    
// const addHandler = () => {
//     setSelectedRow(null)
//     const init = {
//       custCd:'',	
//       custNm:'',				
//       regionCd:'',				
//       calCd:'',				
//       shipmentYn:'Y',				
//       telNo:'',
//       faxNo:'',
//       postNo:'',
//       addStd:'',
//       addDtl:'',
//       manNm:'',
//       manTelNo:'',
//       invoiceMail:'',
//       useYn:'1',
//     }
//     setCalCodeData(init);
//   }

// 고객사 정보 저장 (saveType:1 신규등록, saveType:2 수정), object형식
const saveSubHandler = (calCodeData: CustomerDetailInfo) => {
  const previousCalCodeData = {...calCodeData, saveType:calCodeData.custCd == '' ? 1 : 2 };
  fetch('http://133.186.221.46:8090/test/api/save/customer', {
  method:'post',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(previousCalCodeData)
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    //console.log(data);
    setCalCodeData(data.data);
  })
}
console.log(calCodeData);



const onChanged =(event:{target:any;}) => {
  const colName = event.target.id == "" ? event.target.className : event.target.id;
  console.log(event.target.id);
  console.log(colName);
  //setCalCodeData({...calCodeData, [colName]: event.target.value});
  const updatedCalCodeData = { ...calCodeData, [colName]: event.target.value };
  setCalCodeData(updatedCalCodeData);
  // const updatedData = data.map((item: any) => {
  //   if (item.custCd === updatedCalCodeData.custCd) {
  //     return { ...item, ...updatedCalCodeData };
  //   }
  //   return item;
  // });
  // setData(updatedData);
}



  

    return (
        <>
        <StyleBox>
            <div className='custom-detail'>
            <div className='custom-button'> 
                <p>고객사 상세정보</p>
                {/* <button onClick={() => addHandler()}><img src={'/img/plus_button.png'} /></button> */}
                <button onClick={()=> saveSubHandler(calCodeData)}><img src={'/img/save.png'}/></button>
            </div>
            <div className='detail-wrap'>
                <div className='detail-list'>
                <p className='p1'>고객사코드</p>
                <input type='text' id='custCd' value={calCodeData.custCd} disabled ></input>
                </div>
                <div className='detail-list'>
                <p className='p4'>고객사명</p>
                <input type='text' id='custNm' onInput={checkReg}  maxLength={10} value={calCodeData.custNm} onChange={(e)=>onChanged(e)}></input>
                </div>
                <div className='detail-list'>
                <p className='p2'>지역</p>
                <select className='regionCd'  value={calCodeData.regionCd} onChange={(e)=>onChanged(e)}>
                <option value={""}>기타</option>
                {/* {regionCd.filter((o:any) => o.typeCd ==1 || o.typeCd == 2).map((o: any) => {
                    console.log(o.typeCd, o.typeNm);
                    return <option value={o.typeCd}>{o.typeNm}</option>
                })} */}
                </select> 
                </div>
                <div className='detail-list'>
                <p className='p4'>정산방법</p>
                <select className='calCd' value={calCodeData.calCd}  onChange={(e)=>onChanged(e)}>
                <option value={""}>기타</option>
                {/* {calCd.filter((o:any) => o.typeCd == 1 || o.typeCd == 2).map((o:any)=> {
                    return <option value={o.typeCd}>{o.typeNm}</option>
                })} */}
                </select>
                </div>
                <div className='detail-list'>
                <p className='p4'>출하계획</p>
                <label className='label-wrap'>
                    <input type="radio"  value="Y" className="shipmentYn" 
                    onChange={(e)=>onChanged(e)} checked={calCodeData.shipmentYn =='Y'}
                    />
                    사용
                    <input type="radio" value="N" className="shipmentYn" 
                    onChange={(e)=>onChanged(e)} checked={calCodeData.shipmentYn =='N'}
                    />
                    미사용
                </label>
                </div>
                <div className='detail-list'>
                <p className='p4'>전화번호</p>
                <input type="text" id='telNo' onInput={autoHyphen} maxLength={13} value={calCodeData.telNo} onChange={(e)=>onChanged(e)}  />
                </div>
                <div className='detail-list'>
                <p className='p4'>팩스번호</p>
                <input type='text' id='faxNo' onInput={autoFax} maxLength={10} value={calCodeData.faxNo} onChange={(e)=>onChanged(e)} ></input>
                </div>
                <div className='detail-list'>
                <p className='p4'>우편번호</p>
                <label>
                    <input className='detail-box' id='postNo' value={calCodeData.postNo} onChange={(e)=>onChanged(e)} ></input>
                    {/* <button className='input-button' onClick={handleClick}>
                        <img src={'/img/search.png'} />
                    </button> */}
                </label>
                </div>
                <div className='detail-list'>
                <p className='p4'>기본주소</p>
                <input type='text' value={calCodeData.addStd} onChange={(e)=>onChanged(e)} ></input>
                </div>
                <div className='detail-list'>
                <p className='p4'>상세주소</p>
                <input type='text' id='addDtl' value={calCodeData.addDtl} onChange={(e)=>onChanged(e)} ></input>
                </div>
                <div className='detail-list'>
                <p>당담자</p>
                <input type='text' id='manNm' value={calCodeData.manNm} onChange={(e)=>onChanged(e)}  maxLength={10}></input>
                </div>
                <div className='detail-list'>
                <p>당담자연락처</p>
                <input type='text' id='manTelNo' value={calCodeData.manTelNo} onChange={(e)=>onChanged(e)}  maxLength={13}></input>
                </div>
                <div className='detail-list'>
                <p>계산서수취메일</p>
                <input type='text' id='invoiceMail' value={calCodeData.invoiceMail} onChange={(e)=>onChanged(e)}  maxLength={50}></input>
                </div>
            </div>
            </div>
        </StyleBox>        
        </>
    )
}

export default CustomerDetail;