var sort = 'date';
var amount = 10;
var page = 1;
var size;
var status = 'all';

getDefault();

function getSearch(){
    $('.output').remove();
    let url = getURL();
    console.log(url);

    let j = 0;
    $.getJSON(url, function(data){
        for(let i in data){
            if(data[i].key == 'size'){
                size = data[i].size;
                continue;
            }

            let tableContent = '';

            if (data[i].status == 0)
                tableContent += '<tr class="warning output">';
            if (data[i].status == 1)
                tableContent += '<tr class="success output">';
            if (data[i].status == 2)
                tableContent += '<tr class="danger output">';

            // форматируем дату
            let date_add = new Date(data[i].add_date);
            let _date_add = date_add.format("dd-mm-yyyy");
            let accept_date = new Date(data[i].accept_date);
            let _accept_date='';
            if(data[i].accept_date!=undefined)
                _accept_date = accept_date.format("dd-mm-yyyy");
            else
                _accept_date = '';

            tableContent += '<th scope="row"> <a href="/edit/'+data[i]._id+'">'+(Number(i)+amount*(page-1) + 1)+' </a>';
            tableContent += '<td>'+_date_add+'</td>';
            if (document.getElementById('user_type').value == 'admin')
                tableContent += '<td>'+data[i].recipient+'</td>';
            else
                tableContent += '<td>'+data[i].sender+'</td>';
            tableContent += '<td>'+data[i].source_company+'</td>';
            tableContent += '<td>'+data[i].page+'</td>';
            tableContent += '<td>'+_accept_date+'</td>';
            tableContent += '<td> На рассмотрении</td>';
            tableContent += '<td>'+data[i].chat[data[i].chat.length-1].message+'</td></th></tr>';
            

            $('#sTable').append(tableContent);
            j++;
        }
    }).done(function(){
        // генерим список страниц
        console.log(j);
        if(!(page==1 && j<amount)){
            let tableContent = '<span class="output"> Навигация';
            if (page>1){
                tableContent +=  '<a href="#" onclick="startPage()">'+'&nbsp;<<&nbsp;&nbsp;'+'</a>';   
                tableContent +=  '<a href="#" onclick="prevPage()">'+'Назад'+'</a>';
            }
            let pages = Math.ceil(size/amount);
            tableContent +=  '<span style="color:brown">&nbsp;'+page+'&nbsp;из&nbsp;'+pages+'&nbsp</span>';
            if (page<pages){   
                tableContent +=  '<a href="#" onclick="nextPage()">'+'Вперед'+'</a>';
                tableContent +=  '<a href="#" onclick="endPage()">'+'&nbsp;&nbsp;>>'+'</a>';
            } 
            tableContent += '</span>';
            $('#pagination').append(tableContent);
        }
    });
    
}

function getURL(){
    let source = document.getElementById('search-input').value==''?'null':document.getElementById('search-input').value;
    let s_page = document.getElementById('page-input').value==''?'null':document.getElementById('page-input').value;

    let url = '/search/'+status+'/'+source+'/'+page+'/'+sort+'/'+amount+'/'+s_page;
    return url;
}

function sortPages(){
    page = 1;
    sort = 'pages';
    getSearch();
}

function sortSource(){
    page = 1;
    sort = 'source';
    getSearch();
}

function sortDate(){
    page = 1;
    sort = 'date';
    getSearch();
}

function getDefault(){
    page = 1;
    status = 'all';
    sort = 'date'
    document.getElementById('search-input').value = '';
    document.getElementById('page-input').value = '';
    getSearch();
}

function setPage(_page){
    page = _page;
    getSearch();
}

function nextPage(){
    page++;
    getSearch();
}

function prevPage(){
    page--;
    getSearch();
}

function startPage(){
    page = 1;
    getSearch();
}

function endPage(){
    page = Math.ceil(size/amount);
    getSearch();
}

function vneseni(){
    page = 1;
    status = 'vneseni';
    getSearch();
}

function ne_vneseni(){
    page = 1;
    status = 'ne_vneseni';
    getSearch();
}

function rassmotrenie(){
    page = 1;
    status = 'rassmotrenie';
    getSearch();
}