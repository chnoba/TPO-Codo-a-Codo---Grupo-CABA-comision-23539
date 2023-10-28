function validar()
{
    let nombre = document.getElementById("nombre");
    let apellido = document.getElementById("apellido");
    let email = document.getElementById("email");
    let mensaje = document.getElementById("mensaje");
    let listaPaises= document.getElementById("listaPaises")
    var seleccionado = listaPaises.options[listaPaises.selectedIndex].value;
    let error = false;
    
    document.getElementById("validar_nombre").innerHTML="";
    document.getElementById("validar_apellido").innerHTML="";
    document.getElementById("validar_email").innerHTML="";
    document.getElementById("validar_mensaje").innerHTML="";
    document.getElementById("validar_pais").innerHTML="";

    if(nombre.value == ""){
        document.getElementById("validar_nombre").innerHTML="Debe completar el campo Nombre";
        error = true;
        nombre.focus();
    }

    if(apellido.value == ""){
        document.getElementById("validar_apellido").innerHTML="Debe completar el campo Apellido";
        error = true;
        apellido.focus();
    }

    if(email.value == ""){
        document.getElementById("validar_email").innerHTML="Debe completar el campo Email";
        error = true;
        email.focus();
    }

    if(mensaje.value == ""){
        document.getElementById("validar_mensaje").innerHTML="Debe completar el campo Mensaje";
        error = true;
        mensaje.focus();
    }

    if(seleccionado == "pais"){
        document.getElementById("validar_pais").innerHTML="Debe seleccionar un país";
        error = true;
    }


    if(error == false){
        document.getElementById("nombre").value="";
        document.getElementById("validar_nombre").innerHTML="";

        document.getElementById("apellido").value="";
        document.getElementById("validar_apellido").innerHTML="";

        document.getElementById("email").value="";
        document.getElementById("validar_email").innerHTML="";

        document.getElementById("mensaje").value="";
        document.getElementById("validar_mensaje").innerHTML="";
        
        document.getElementById("validar_pais").innerHTML=""

        alert("Datos enviados");
    }

    return !error;
}