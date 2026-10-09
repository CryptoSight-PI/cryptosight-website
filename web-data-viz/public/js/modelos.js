const gpu = document.querySelector('.gpu');
const rig = document.querySelector('.minerig');
const gpu3d = document.querySelector('.gpu3d');
const rig3d = document.querySelector('.minerig3d');
const titulogpu = document.querySelector('.tituloGPU');
const titulorig = document.querySelector('.tituloRig');
const descgpu = document.querySelector('.descGPU');
const descrig = document.querySelector('.descRig');

gpu.addEventListener('click', function(){
    gpu3d.classList.add('ativo');
    rig3d.classList.remove('ativo');
    gpu.classList.add('selecionado');
    rig.classList.remove('selecionado');
    titulogpu.classList.add('ativo');
    titulorig.classList.remove('ativo');
    descgpu.classList.add('ativo');
    descrig.classList.remove('ativo');
});

rig.addEventListener('click', function(){
    gpu3d.classList.remove('ativo');
    rig3d.classList.add('ativo');
    gpu.classList.remove('selecionado');
    rig.classList.add('selecionado');
    titulogpu.classList.remove('ativo');
    titulorig.classList.add('ativo');
    descgpu.classList.remove('ativo');
    descrig.classList.add('ativo');
});