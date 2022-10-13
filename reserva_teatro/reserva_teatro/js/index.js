//obter os elementos da página
const frm = document.querySelector("form");
const dvPalco = document.querySelector("#divPalco");

//constante para definir o número de poltronas
const POLTRONAS = 240;

//vetor com as poltronas reservadas pelo cliente
const reservadas = [];

window.addEventListener("load", () =>{
    //operador ternário
    //se houver dados salvos em localstorage, faz um split(";") e atribui esses dados ao array, caso contrario, incializamos o array
    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";")
    : [];

    //montar o numero total de poltronas (definidas pela constante)
    for (let i = 1; i <= POLTRONAS; i++){
        const figure = document.createElement("figure"); //cria a tag figure
        const imgStatus = document.createElement("img"); //cria a tag img

        //se a posição estiver ocupada, exibe a imagem ocupada, se não a imagem disponivel
        imgStatus.src = ocupadas.includes(i.toString())
        ? "img/ocupada.jpg"
        : "img/disponivel.jpg";
        imgStatus.className = "poltrona"; //classe com a dimensão da imagem

        const figureCap = document.createElement("figcaption");//cria figcaption

        //quantidade de zeros antes do número de poltrona
        const zeros = i < 10 ? "00" : i < 100 ? "0" : "";

        const num = document.createTextNode(`[${zeros}${i}]`);//cria o texto

        //define os pais de cada tag criada
        figureCap.appendChild(num);
        figure.appendChild(imgStatus);
        figure.appendChild(figureCap);

        //se i módulo de 24 == 12 (é o corredor: define margem direita 60px)
        if (i % 24 == 12) figure.style.marginRight = "60px"

        dvPalco.appendChild(figure); //indica que a figura é filha de divPalco

        //se i módulo 24 == 0: o código apos o && será executado (inserido quebra de linha)
        (i % 24 == 0) && dvPalco.appendChild(document.createElement("br"));
    }
})

frm.addEventListener("submit", (e) =>{
    e.preventDefault();

    //obtem o conteúdo do input
    const poltrona = Number(frm.inPoltrona.value);

    //valida o preenchimento de entrada
    if(poltrona > POLTRONAS){
        alert("Informe um número de poltronas válido!");
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }

    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";")
    : [];

    //validar se a poltrona ja estiver ocupada
    if(ocupadas.includes(poltrona.toString())){
        alert(`Poltrona ${poltrona} já está ocupada!`)
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }

    //capturar a imagem da poltrona, filha de divPalco.
    const imgPoltrona = dvPalco.querySelectorAll("img")[poltrona -1]

    imgPoltrona.src = "img/reservada.jpg"; //modifica o atributo da img

    reservadas.push(poltrona); //adiciona a poltrona ao vetor

    frm.inPoltrona.value = "";
    frm.inPoltrona.focus();

});

frm.btConfirmar.addEventListener("click", () =>{
    //verificar se não há poltronas reservadas
    if (reservadas.length == 0){
        alert("Não há poltronas reservadas!")
        frm.inPoltrona.focus()
        return
    }

    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";")
    : [];

    //for decrecente, pois as reservas vão sendo removidas a cada alteração da imagem
    for (let i = reservadas.length -1; i>=0; i--){
        ocupadas.push(reservadas[i]);

        //captura a imagem da poltrona, filha de divPalco. É -1 pois começa em 0
        const imgPoltrona = dvPalco.querySelectorAll("img")[reservadas[i] - 1];
        imgPoltrona.src = "img/ocupada.jpg"; //modifica a imagem

        reservadas.pop(); //remove do vetor a reserva já alterada
    }

    localStorage.setItem("teatroOcupadas", ocupadas.join(";"));
});

frm.btCancelar.addEventListener("click", () =>{
    const cancelar = prompt("Qual poltrona reservada deseja cancelar?")
    alert("Tem certeza que deseja remover a reserva?")
    frm.inPoltrona.focus()

    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";")
    : [];

    ocupadas[cancelar].split(0);

    for (let i = ocupadas.length -1; i>=0; i--){

        const imgPoltrona = dvPalco.querySelectorAll("img")[ocupadas[i] - 1];
        imgPoltrona.src = "img/disponivel.jpg"; //modifica a imagem

        ocupadas.pop(); //remove do vetor a reserva já alterada
    }

    localStorage.setItem("teatroOcupadas", ocupadas.join(";"));
})