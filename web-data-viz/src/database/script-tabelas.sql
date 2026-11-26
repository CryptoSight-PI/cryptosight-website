create database cryptosight;
use cryptosight;

create table uf(
	id int auto_increment primary key,
    nome varchar(40),
    sigla char(2),
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp
);

create table endereco(
	id int auto_increment primary key,
    cep char(8),
    id_uf int,
    cidade varchar(50),
    bairro varchar(50),
    logradouro varchar(50),
    numero varchar(10),
    complemento varchar(30),
    sede tinyint not null,
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp,
    constraint fk_endereco_uf foreign key (id_uf) references uf(id)
);

create table empresa(
	id int auto_increment primary key,
    razao_social varchar(60),
    senha varchar(255) not null,
    telefone char(11),
   	email varchar(70) not null unique,
    nome_fantasia varchar(50),
    cnpj char(14) unique,
    token_jira varchar(2500),
    url_jira varchar(2500), 
    id_endereco int unique,
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp,
    constraint fk_empresa_endereco foreign key(id_endereco) references endereco(id)
);

create table farm(
	id int auto_increment primary key,
    nome varchar(50),
    id_empresa int,
    id_endereco int unique,
    aluguel decimal(12,2) default 0.0,
    dia_pagamento_aluguel tinyint,
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp,
	constraint fk_farm_empresa foreign key (id_empresa) references empresa(id),
    constraint fk_farm_endereco foreign key(id_endereco) references endereco(id),
    constraint chk_dia_pagamento check (dia_pagamento_aluguel between 1 and 31),
    index idx_farm_empresa (id_empresa),
    index idx_farm_endereco (id_endereco)
);

create table usuario (
	id int auto_increment primary key,
	nome varchar(50) not null,
    cargo varchar(30),
    cpf char(11) not null unique,
	email varchar(70) not null unique,
	senha varchar(255),
    id_empresa int not null,
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp,
    constraint fk_usuario_empresa foreign key (id_empresa) references empresa(id),
    index idx_usuario_empresa (id_empresa)
);

create table usuario_farm(
    id_usuario int not null,
    id_farm int not null,
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp,
    primary key(id_usuario, id_farm),
    constraint fk_usuario_farm_usuario foreign key(id_usuario) references usuario(id),
    constraint fk_usuario_farm_farm foreign key(id_farm) references farm(id),
    index idx_uf_farm (id_farm)
);

create table sessao (
	id int primary key auto_increment,
    nome varchar(80),
    descricao varchar(244),
    id_farm int not null,
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp,
    constraint fk_sessao_farm foreign key (id_farm) references farm (id)
);

create table maquina (
    id int auto_increment primary key,
    mac_address char(17) not null unique,
    modelo varchar(50) not null,
    fabricante varchar(50) not null,
    tipo varchar(20) not null,
    id_sessao int not null,
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp,
    constraint fk_maquina_sessao foreign key (id_sessao) references sessao(id),
    index idx_maquina_sessao (id_sessao)
);

create table coleta_rede (
    id bigint auto_increment primary key,
    id_maquina int not null,
    latencia_ms decimal(8,2),
    jitter_ms decimal(8,2),
    perda_pct decimal(5,2),
    data_hora_coleta datetime not null default current_timestamp,
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp,
    constraint fk_coleta_maquina foreign key (id_maquina) references maquina(id),
    index idx_coleta_maquina_data (id_maquina, data_hora_coleta)
);

create table componente(
	id int auto_increment primary key,
	nome varchar(30),
    medida varchar(30),
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp
);

create table maquina_componente(
	id int auto_increment primary key,
    id_maquina int not null,
    id_componente int not null,
    limite_max decimal(10 , 2),
    limite_min decimal(10 , 2),
    monitorado tinyint,
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp,
     constraint fk_mc_maquina foreign key (id_maquina) references maquina(id),
     constraint fk_mc_componente foreign key (id_componente) references componente(id),
     index idx_mc_componente (id_componente)
    );
    
    create table criptomoeda(
    id int primary key auto_increment,
    nome varchar(100),
    simbolo varchar(20) unique,
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp
    );
    
    create table maquina_criptomoeda(
    id int primary key auto_increment,
    id_maquina int,
    id_criptomoeda int,
    criacao timestamp default current_timestamp,
    atualizacao timestamp default current_timestamp on update current_timestamp,
    constraint fk_mcrpt_maquina foreign key (id_maquina) references maquina (id),
    constraint fk_mcrpt_criptomoeda foreign key (id_criptomoeda) references criptomoeda (id)
    );



create table alerta (
	id int auto_increment primary key,
	id_mc int not null,
	descricao varchar(255),
	severidade varchar(20) not null,
	valor_detectado decimal(10,2),
	data_hora_detectado datetime not null,
	status varchar(10) not null, 
	data_hora_resolvido datetime null,
	chave_jira varchar(20),
	criacao timestamp default current_timestamp,
	atualizacao timestamp default current_timestamp on update current_timestamp,
	constraint chk_status check (status in('resolvido', 'a resolver')),
	constraint fk_alerta_mc foreign key (id_mc) references maquina_componente(id),
	index idx_alerta_mc (id_mc)
);

create table pagamento (
	id int auto_increment primary key,
    id_usuario int not null,
    id_farm int not null,
	valor decimal(12,2) not null,
    categoria varchar(25),
    data_hora_pagamento timestamp default current_timestamp,
    criacao timestamp default current_timestamp,
	atualizacao timestamp default current_timestamp on update current_timestamp,
    constraint chk_categoria check (categoria in('Local de Farm comprado', 'Componente comprado', 'Rig comprada', 'Componente trocado')),
    constraint fk_pagamento_responsavel foreign key(id_usuario) references usuario(id),
    constraint fk_pagamento_farm foreign key(id_farm) references farm(id)
);