let listField = $("[id$=-field]");
function toggleFormError(name, msg){
    let field = $(`#${name}-field`);
    field.children(".field").addClass("is-invalid").removeClass("is-valid");
    field.children("#error").removeAttr("hidden").text(msg);
}
function setFormValid(){
    listField.each(function(idx, el) {
        $(el).children(".field").addClass("is-valid").removeClass("is-invalid");
        $(el).children("#error").attr("hidden", "true");
    });
}
function setFormProcess(form, action, method, onSuccess=function(){}){
    form.addEventListener("submit", function(ev){
        ev.preventDefault();
        let data = new FormData(form);
        fetch(action, {
            method: method,
            body: data
        }).then(res => {
            if(res.status == 204) {
                onSuccess();
            }
            else return res.json();
        }).then(data => {
            if (data !== undefined){
                setFormValid();
                for(let key in data.errors){
                    toggleFormError(key, data.errors[key]);
                }
            }
        });
    });
}