function recipient(){
    let elements = document.getElementsByClassName('recipient');
    for(let i=0; i<elements.length; i++){
        elements[i].style="display:hidden";
    }
    document.getElementById('_recipient').style="display:none"
}

function source_company(){
    let elements = document.getElementsByClassName('source_company');
    for(let i=0; i<elements.length; i++){
        elements[i].style="display:hidden";
    }
    document.getElementById('_source_company').style="display:none"
}

function page(){
    let elements = document.getElementsByClassName('page');
    for(let i=0; i<elements.length; i++){
        elements[i].style="display:hidden";
    }
    document.getElementById('_page').style="display:none"
}

function comment(){
    let elements = document.getElementsByClassName('comment');
    for(let i=0; i<elements.length; i++){
        elements[i].style="display:hidden";
    }
    document.getElementById('_comment').style="display:none"
}

function screen(){
    let elements = document.getElementsByClassName('screen');
    for(let i=0; i<elements.length; i++){
        elements[i].style="display:hidden";
    }
    document.getElementById('_screen').style="display:none"
}

function status(){
    let elements = document.getElementsByClassName('status');
    for(let i=0; i<elements.length; i++){
        elements[i].style="display:hidden";
    }
    document.getElementById('_status').style="display:none"
}

function validate_form ( )
{
	valid = true;

        if ( document.contact_form.source_company.value == "" ||
             document.contact_form.page.value == "" ||
             document.contact_form.chat.value == ""
           )
        {
                alert ( "Пожалуйста заполните dсе необходимые поля" );
                valid = false;
        }

        return valid;
}