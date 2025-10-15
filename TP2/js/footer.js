'use strict';

const tituloEmpresa = document.getElementById('titulo-empresa');
const tituloComunidad = document.getElementById('titulo-comunidad');
const tituloCategorias = document.getElementById('titulo-categorias');
const tituloSoporte = document.getElementById('titulo-soporte');
const tituloLinks = document.getElementById('titulo-links');
const tituloLegal = document.getElementById('titulo-legal');

const divEmpresa = document.getElementById('div-empresa');
const divComunidad = document.getElementById('div-comunidad');
const divCategorias = document.getElementById('div-categorias');
const divSoporte = document.getElementById('div-soporte');
const divLinks = document.getElementById('div-links');
const divLegal = document.getElementById('div-legal');

const flechaAbajo = ' ⏷';
const flechaArriba = ' ⏶';

const sobreEmpresa = 'Sobre la Empresa';
const comunidad = 'Comunidad';
const categorias = 'Categorías de juegos';
const soporte = 'Soporte';
const links = 'Links de interés';
const legal = 'Legal y privacidad';

document.addEventListener('DOMContentLoaded', renombrarTitulos)

window.addEventListener('resize', renombrarTitulos)

tituloEmpresa.addEventListener('click', function() {
    if (tituloEmpresa.textContent === sobreEmpresa + flechaArriba) {
        tituloEmpresa.textContent = sobreEmpresa + flechaAbajo;
        divEmpresa.style.marginBottom = '0px'
    } else {
        tituloEmpresa.textContent = sobreEmpresa + flechaArriba;
        divEmpresa.style.marginBottom = '240px'
    }
    const ulEmpresa = document.getElementById('ul-empresa');
    ulEmpresa.classList.toggle('abierto');
})

tituloComunidad.addEventListener('click', function() {
    if (tituloComunidad.textContent === comunidad + flechaArriba) {
        tituloComunidad.textContent = comunidad + flechaAbajo;
        divComunidad.style.marginBottom = '0px'
    } else {
        tituloComunidad.textContent = comunidad + flechaArriba;
        divComunidad.style.marginBottom = '290px'
    }
    const ulComunidad = document.getElementById('ul-comunidad');
    ulComunidad.classList.toggle('abierto');
})

tituloCategorias.addEventListener('click', function() {
    if (tituloCategorias.textContent === categorias + flechaArriba) {
        tituloCategorias.textContent = categorias + flechaAbajo;
        divCategorias.style.marginBottom = '0px'
    } else {
        tituloCategorias.textContent = categorias + flechaArriba;
        divCategorias.style.marginBottom = '710px'
   }
    const ulCategorias = document.getElementById('ul-game-list');
    ulCategorias.classList.toggle('abierto');
})

tituloSoporte.addEventListener('click', function() {
    if (tituloSoporte.textContent === soporte + flechaArriba) {
        tituloSoporte.textContent = soporte + flechaAbajo;
        divSoporte.style.marginBottom = '0px'
    } else {
        tituloSoporte.textContent = soporte + flechaArriba;
        divSoporte.style.marginBottom = '450px'
    }
    const ulSoporte = document.getElementById('ul-soporte');
    ulSoporte.classList.toggle('abierto');
})

tituloLinks.addEventListener('click', function() {
    if (tituloLinks.textContent === links + flechaArriba) {
        tituloLinks.textContent = links + flechaAbajo;
        divLinks.style.marginBottom = '0px'
    } else {
        tituloLinks.textContent = links + flechaArriba;
        divLinks.style.marginBottom = '350px'
    }
    const ulLinks = document.getElementById('ul-links-interes');
    ulLinks.classList.toggle('abierto');
})

tituloLegal.addEventListener('click', function() {
    if (tituloLegal.textContent === legal + flechaArriba) {
        tituloLegal.textContent = legal + flechaAbajo;
        divLegal.style.marginBottom = '0px'
    } else {
        tituloLegal.textContent = legal + flechaArriba;
        divLegal.style.marginBottom = '375px'
    }
    const ulLegal = document.getElementById('ul-legal');
    ulLegal.classList.toggle('abierto');
})

function renombrarTitulos() {
    if (window.innerWidth <= 450) {
        tituloEmpresa.textContent = sobreEmpresa + flechaAbajo;
        tituloComunidad.textContent = comunidad + flechaAbajo;
        tituloCategorias.textContent = categorias + flechaAbajo;
        tituloSoporte.textContent = soporte + flechaAbajo;
        tituloLinks.textContent = links + flechaAbajo;
        tituloLegal.textContent = legal + flechaAbajo;
    } else {
        tituloEmpresa.textContent = sobreEmpresa;
        tituloComunidad.textContent = comunidad;
        tituloCategorias.textContent = categorias;
        tituloSoporte.textContent = soporte;
        tituloLinks.textContent = links;
        tituloLegal.textContent = legal;
    }
}
