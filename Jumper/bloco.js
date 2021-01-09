bloco = {
	x: 10,
	y: 50,
	altura: 50,
	largura: 50,
	velocidade: 0,
	pulo: 1,
	cor: corDown,
	corMorte: "black",
	massa: 1.5,
	acele: 0,
	img: "",
	img2: "",
	imgAr: "",
	imgMorto: "",

	//atualizacoes do bloco
	Atualiza: function()
	{
		this.acele+=gravidade;
		//desce o bloco
		if(this.y < 500-this.altura && jogo != 2)
			this.y += this.acele;
		else if(jogo == 2)
			this.y += this.acele;
		else
		{
			this.y = 450;
			this.acele = 0;
		}
		if(this.y >= 500-this.altura)
			this.pulo = 1;
		//diminui a velocidade em razão da gravidade
		if(this.velocidade != 0)
			this.velocidade -= gravidade;

		//atualiza posição y do bloco
		this.y -= this.velocidade;
	},
	//executa o pulo do bloco
	Pula: function()
	{
		//pula
		this.pulo++;
		this.velocidade += 22;
	},
	//desenha o bloco
	Desenha: function()
	{
		noStroke();
		if(morto)
			image(this.imgMorto, this.x, this.y, this.largura, this.altura);
		else if(this.pulo === 1)
		{
			if(trocaSprite >= 0)
			{
				image(this.img, this.x, this.y, this.largura, this.altura);
				trocaSprite--;
			}
			else
			{
				image(this.img2, this.x, this.y, this.largura, this.altura);
				trocaSprite--;
				if(trocaSprite === -10)
					trocaSprite = 10;
			}
		}
		else
			image(this.imgAr, this.x, this.y, this.largura, this.altura);
		//rect(this.x, this.y, this.largura, this.altura);
	}
}
obstaculo = {
	obst: [],
	tempo: 0,
	velocidade: 5,
	cor: corDown,

	//gera um obstaculo
	Gera: function()
	{
		if(this.tempo == 0)
		{
			this.obst.push({
				largura: int(random(30, 50)),
				altura: 500,
				y: int(random(250, 450)),
				x: width,
			});
			this.tempo = int(random(70, 100));
		}
	},
	//movimenta um obstaculo
	Movimenta: function()
	{
		for(let i = 0; i < this.obst.length; i++)
		{
			this.obst[i].x -= this.velocidade;
			if(this.obst[i].x < -this.obst[i].largura)
			{
				this.obst.splice(i, 1);
				pontos++;
				cenarioValor++;
			}
		}
	},
	//desenha um obstaculo
	Desenha: function()
	{
		if(jogo!==3)
			this.tempo--;
		fill(this.cor);
		for(let i = 0; i < this.obst.length; i++)
		{
			rect(this.obst[i].x, this.obst[i].y, this.obst[i].largura, this.obst[i].altura);
		}
	}
}
chao = {
	Pinta: function()
	{
		rect(0, 500, width, height);
	}
}