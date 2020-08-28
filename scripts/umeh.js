var API_server = "http://127.0.0.1:8081";

var search_button = document.getElementById("search");

function searcher() {
  search_button.setAttribute("disabled", "");
  search_button.innerHTML = "查询中...";

  var request_search = new XMLHttpRequest();

  try {
    request_search.onreadystatechange = function () {
      if (request_search.readyState === XMLHttpRequest.DONE) {
        var resp_text = request_search.responseText;

        try {
          var resp_json = JSON.parse(resp_text);
          if (resp_json.course_info.New_code === undefined) {
            throw "New_code未定义。";
          }

          document.getElementById("title").innerHTML =
            resp_json.course_info.New_code;

          document.getElementById("course_name").innerHTML =
            resp_json.course_info.courseTitleEng;

          document.getElementById("course_info").innerHTML =
            "学院：" +
            resp_json.course_info.Offering_Unit +
            "&nbsp;&nbsp;&nbsp;专业：" +
            resp_json.course_info.Offering_Department;

          document.getElementById("judge_table").removeAttribute("hidden");
          document.getElementById("umicon").setAttribute("hidden", "");
          search_button.innerHTML = "查询";
          search_button.removeAttribute("disabled");
          document.getElementById("course_num").removeAttribute("disabled");

          if (resp_json.prof_info.length === 0) {
            document.getElementById("course_rank").innerHTML = "暂时没有评分";
            document
              .getElementById("judge_table_body")
              .setAttribute("hidden", "");
            document
              .getElementById("judge_table_head")
              .setAttribute("hidden", "");
          } else {
            rank = 0;
            document.getElementById("judge_table_body").innerHTML = " ";
            for (i in resp_json.prof_info) {
              rank += resp_json.prof_info[i].result;
              document.getElementById("judge_table_body").innerHTML +=
                '<tr><td class="mdl-data-table__cell--non-numeric">' +
                resp_json.prof_info[i].name +
                "</td><td>" +
                String((resp_json.prof_info[i].result * 2).toFixed(2)) +
                "/10</td></tr>";
            }

            document.getElementById("course_rank").innerHTML =
              String(((rank / resp_json.prof_info.length) * 2).toFixed(2)) +
              "/10";

            document
              .getElementById("judge_table_body")
              .removeAttribute("hidden");
            document
              .getElementById("judge_table_head")
              .removeAttribute("hidden");
          }
        } catch (e) {
          alert("输入的课号无效，请重试。\r错误代码：" + String(e));

          search_button.innerHTML = "查询";
          search_button.removeAttribute("disabled");
          document.getElementById("course_num").removeAttribute("disabled");
        }
      }
    };

    request_search.open(
      "GET",
      API_server +
        "/course_info/?New_code=" +
        document.getElementById("course_num").value
    );

    document.getElementById("course_num").value = "";
    document.getElementById("course_num").setAttribute("disabled", "");

    request_search.send();
  } catch (e) {
    alert("网络请求出现问题，请重试。\r错误代码：" + String(e));
  }
}

search_button.onclick = searcher;
document
  .getElementById("course_num")
  .setAttribute("onkeypress", "if(event.keyCode==13) {searcher()}");