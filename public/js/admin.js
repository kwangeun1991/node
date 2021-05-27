/**
* 취업 우대 및 병역 항목 선택시
* 장애, 병역 선택에 따른 항목 노출
*
*/
function updateBenefit()
{
  $list = $(".benefit input[type='checkbox']:checked");
  let isAdditionalSelect = false;
  $(".additional_select .additional_select dl").removeClass("dn").addClass("dn");
  $.each($list, function() {
    const benefit = $(this).val();
    if (benefit == '장애') {
      isAdditionalSelect = true;
      $(".additional_select .handicap").removeClass("dn");
    } else if (benefit == '병역') {
      isAdditionalSelect = true;
      $(".additional_select .military").removeClass("dn");
    }
  });

  if (isAdditionalSelect) {
    $(".additional_select").removeClass("dn");
  }
}

/**
* 프로필 사진 업로드 처리
*
* @param Boolean isSuccess - 업로드 성공 / 실패
*/
function uploadCallback(isSuccess)
{
  /**
  * 성공 - 1. 프로필 사진 - 사진영역에 추가 붙여놓고
  *        2. 레이어 팝업 닫기
  * 실패 - 1. 업로드 실패 메세지 출력후 레이어 팝업 닫기
  */
  //console.log(isSuccess);
  if (isSuccess) {
    const tag = `<img src='/profile/profile'>`;
    $(".photo_upload").html(tag);
  } else {
    alert("이미지 업로드 실패");
  }

  layer.close();
}

$(function() {
  // 파일 업로드 처리
  $("body").on("change", ".upload_box input[type='file']", function() {
    frmUpload.submit();
  });

  // 주소검색
  $(".search_address").click(function() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            // 예제를 참고하여 다양한 활용법을 확인해 보세요.

            //console.log(data);
            $("input[name='address']").val(data.address);
        }
    }).open();
  });

  // 양식 추가 처리
  $(".add_form").click(function() {
    const type = $(this).data("type");
    let template = '';
    switch (type) {
      case "학력" :
        template = "school";
        break;
      case "경력" :
        template = "job_history";
        break;
      case "인턴" :
        template = "intern";
        break;
      case "교육" :
        template = "education";
        break;
      case "자격증" :
        template = "license";
        break;
      case "수상" :
        template = "award";
        break;
      case "해외경험" :
        template = "overseas";
        break;
      case "어학" :
        template = "language";
        break;
      case "자기소개서" :
        template = "introduction";
        break;
    }

    if (template) {
      let html = $("#template_" + template).html();

      $target = $(this).closest(".form_inner").find(".form_html");
      if ($target.length > 0) {
        const no = new Date().getTime();
        html = html.replace(/<%=no%>/g, no);
      }

      $target.append(html);
    }
  });

  // 양식 제거 처리
  $("body").on("click", ".form_html .remove", function() {
    $(this).closest(".rows").remove();
  });

  // textarea 확대 축소 처리
  $("body").on("focus", ".form_html textarea", function() {
    if (!$(this).hasClass("intro")) {
      $(this).removeClass("h200").addClass("h200");
    }
  });

  $("body").on("blur", ".form_html textarea", function() {
    $(this).removeClass("h200");
  })

  // 취업우대 및 병역 클릭(보임 안보임) 처리
  $(".benefit input[type='checkbox']").click(function () {
    updateBenefit();
  });

});
