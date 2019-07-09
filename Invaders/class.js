Nave = {
	x: 10,
	y: 10,
	largura: 20,
	altura: 10,
	cor: "white",
	pos: 1,
	posRelativa: 1,
	killRelativo: 0,
	vida: 2,
	hit: false,
	hitTempo: 0,

	//movimenta a nave
	Movimenta: function(direc)
	{
		if(direc === 0)//ArrowDown
		{
			switch(this.y)
			{
				case 10:
					this.y =  50;
					this.pos = 2;
					break;
				case 50:
					this.y = 90;
					this.pos = 3;
					break;
				case 90:
					this.y = 130;
					this.pos = 4;
					break;
				case 130:
					this.y = 10;
					this.pos = 1;
					break;
			}
		}
		else if(direc === 1)//ArrowUp
		{
			switch(this.y)
			{
				case 10:
					this.y = 130;
					this.pos = 4;
					break;
				case 130:
					this.y = 90;
					this.pos = 3;
					break;
				case 90:
					this.y = 50;
					this.pos = 2;
					break;
				case 50:
					this.y = 10;
					this.pos = 1;
					break;
			}
		}
	},
	//checa se o player está parado muito tempo
	ChecaMovimento: function()
	{
		if(this.posRelativa == this.pos)
		{
			this.killRelativo++;
			if(this.killRelativo == 7)
			{
				if(probabilidade = Math.floor(Math.random() * (101 - 1) + 1) >= 50)
					this.Movimenta(0);
				else
					this.Movimenta(1);
			}
		}
		else
		{
			this.posRelativa = this.pos;
			this.killRelativo = 0;
		}
	},
	//desenha a nave
	Desenha: function()
	{
		if(Nave.vida == 1)
			this.cor = "darkgray";
		else if(Nave.vida <= 3)
			this.cor = "white";
		else if(Nave.vida <= 5)
			this.cor = "orange";
		else
			this.cor = "purple";
		if(this.hitTempo%2 == 0)
		{
			ctx.fillStyle = this.cor;
			ctx.fillRect(this.x, this.y, this.largura, this.altura);
		}
		else
		{
			ctx.fillStyle = "black";
			ctx.fillRect(this.x, this.y, this.largura, this.altura);
		}
		if(this.hit == true)
		{
			this.hitTempo++;
			if(this.hitTempo == 100)
			{
				this.hitTempo = 0;
				this.hit = false;
			}
		}
		
		ctx.fillStyle = "lightred";
		ctx.font = "12px Float";
		ctx.fillText("vidas: x" + this.vida, larg/2-20, 10);
	}	
}
Projetil = {
	proj: [],
	cor: "yellow",
	largura: 10,
	altura: 5,
	velocidade: 7,
	limite: 3,
	//gera um novo projétil
	Gera: function()
	{
		if(this.proj.length < this.limite)
		{
			this.proj.push({
				y: Nave.y+2.5,
				x: 10
			});
			Emite("square");
		}
		
	},
	//locomove o projétil
	Locomove: function()
	{
		for(var i = 0, t = this.proj.length; i < t; i++)
		{
			if(!this.Acerta(this.proj[i], i))
			{
				this.proj[i].x += this.velocidade;
				if(this.proj[i].x >= larg-30)
				{
					this.proj.splice(i, 1);
					t--;
				}
			}
			else
				t--;
		}
	},
	//testa se o projétil acertou algum inimigo ou outro projétil
	Acerta: function(proj, posi)
	{
		for(var i = 0; i < Bonus.bon.length; i++)
		{
			if(proj.y-2.5 == Bonus.bon[i].y && proj.x > Bonus.bon[i].x)
			{
				Bonus.bon.splice(i, 1);
				return true;
			}
		}
		for(var i = 0; i < ProjetilInimigo.proj.length; i++)
		{
			if(proj.y == ProjetilInimigo.proj[i].y && proj.x > ProjetilInimigo.proj[i].x)
			{
				Emite("sine");
				this.proj.splice(posi, 1);
				ProjetilInimigo.proj.splice(i, 1);
				return true;
			}
		}
		for(var i = 0; i < Inimigo.ini.length; i++)
		{
			if((proj.y - 2.5 == Inimigo.ini[i].y) && (proj.x > Inimigo.ini[i].x))
			{
				this.proj.splice(posi, 1);
				Inimigo.ini[i].vida--;

				if(Inimigo.ini[i].vida == 1)
					Inimigo.ini[i].cor = "red";
				else
				{
					if(Inimigo.ini[i].formato == 0)
					{
						pontos++;
						Emite("sawtooth");
					}
					else
					{
						pontos+=2;
						Emite("sawtooth");
					}
					Inimigo.ini.splice(i, 1);
					Nave.ChecaMovimento();
				}
				return true;
			}
		}
		return false;
	},
	//desenha os projéteis
	Desenha: function()
	{
		for(var i = 0; i < this.proj.length; i++)
		{
			ctx.fillStyle = this.cor;
			ctx.fillRect(this.proj[i].x, this.proj[i].y, this.largura, this.altura);
		}
	}
}
Inimigo = {//270
	ini: [],
	largura: 20,
	altura: 10,
	pos: [1,2,3,4],
	intervalo: 0,
	velocidade: 5,
	limit: 54,

	//gera um inimigo
	Gera: function()
	{
		var tipo = this.Tipo();
		if(tipo == 0)
		{
			this.ini.push({
				x: larg - 30,
				y: this.Linha(),
				cor: "red",
				vida: 1,
				posx: 0,
				formato: 0
			});
		}
		if(tipo == 1)
		{
			this.ini.push({
				x: larg - 30,
				y: this.Linha(),
				cor: "blue",
				vida: 2,
				posx: 0,
				formato: 1
			});
		}

		this.intervalo = 20 + Math.floor(10 * Math.random());
	},
	//retorna um tipo de inimigo
	Tipo: function()
	{
		var probabilidade = Math.floor(Math.random() * (101 - 1) + 1);
		if(probabilidade <= 65)
			return 0;
		else
			return 1;
	},
	//gera uma linha aleatória para o inimigo(1-4)
	Linha: function()
	{
		this.pos = Math.floor(Math.random() * (5 - 1) + 1);
		switch(this.pos)
		{
			case 1:
				return 10;
			case 2:
				return 50;
			case 3:
				return 90;
			case 4:
				return 130;
		}
	},
	//faz a movimentação do inimigo
	Movimenta: function()
	{
		for(var i = 0, t = this.ini.length; i < t; i++)
		{
			if(this.ini[i].x <= Nave.largura)
			// if(this.ini[i].posx == this.limit && jogo)
			{
				if(this.ini[i].y == Nave.y && !Nave.hit)
				{
					this.ini[i].y += 800;

					for(var i = 0; i < 10; i++)
						Emite("sine");
					Nave.vida--;
					Nave.hit = true;
					if(Nave.vida == 0)
					{
						jogo = 3;
						Checa();
					}
					// jogo = 2;
					// alert("perdeste");
					//window.location.reload(true);
				}
				this.ini.splice(i, 1);
				t--;
			}
			else
			{
				this.ini[i].posx += 1;
				this.ini[i].x = larg - this.velocidade*this.ini[i].posx;
			}		
		}
	},
	//destaca o momento em que um novo inimigo ou um projétil inimigo deve ser criado
	Atualiza: function()
	{
		if(this.intervalo == 0)
			this.Gera();
		for(var i = 0; i < this.ini.length; i++)
		{
			if(Math.floor(Math.random() * (101 - 1) + 1) <= 30)
				ProjetilInimigo.Gera(i);
		}
		this.intervalo--;
	},
	//desenha os inimigos
	Desenha: function()
	{
		for(var i = 0; i < this.ini.length; i++)
		{
			ctx.fillStyle = this.ini[i].cor;
			ctx.fillRect(this.ini[i].x, this.ini[i].y, this.largura, this.altura);
		}
	}
}
ProjetilInimigo = {
	proj: [],
	largura: 10,
	altura: 5,
	cor: "purple",
	tempo: 0,
	velocidade: 7,
	//gera novos projéteis
	Gera: function(i)
	{
		if(this.tempo == 0)
		{
			this.proj.push({
				y: Inimigo.ini[i].y+2.5,
				x: Inimigo.ini[i].x,
			});
			Emite("triangle");
			this.tempo = 15 + Math.floor(8 * Math.random());
		}
		this.tempo--;
	},
	//movimenta os projéteis
	Locomove: function()
	{
		this.Acerta();
		for(var i = 0; i < this.proj.length; i++)
		{
			this.proj[i].x -= this.velocidade;
			if(this.proj[i].x <= Nave.x)
			{
				this.proj.splice(i, 1);
			}
		}
	},
	//verifica se algum projétil acertou o player
	Acerta: function()
	{
		for(var i = 0; i < this.proj.length; i++)
		{
			if(this.proj[i].y - 2.5 == Nave.y && this.proj[i].x <= Nave.largura && !Nave.hit)
			{
				for(var i = 0; i < 10; i++)
					Emite("sine");
				Nave.vida--;
				Nave.hit =true;
				if(Nave.vida == 0)
				{
					jogo = 3;
					Checa();
				}
				this.proj.splice(i, 1);
				break;
				// jogo = 2;
				// Emite("sawtooth");
				// alert("Foste atingido!");
			}
		}
	},
	//desenha os projéteis na tela
	Desenha: function()
	{
		for(var i = 0; i < this.proj.length; i++)
		{
			ctx.fillStyle = this.cor;
			ctx.fillRect(this.proj[i].x, this.proj[i].y, this.largura, this.altura);
		}
	}
}
Bonus = {
	velocidade: 3,
	bon: [],
	largura: 30,
	altura: 15,

	Verifica: function()
	{
		var probabilidade = Math.floor(Math.random() * (2001 - 1) + 1);
		if(this.bon.length < 2)
		{
			if(probabilidade == 1)
				this.BonusTipo(0, false);
			else if(probabilidade == 2)
				this.BonusTipo(1, false);
			else if(probabilidade >= 3 && probabilidade <= 5)
				this.BonusTipo(2, false);
			else if(probabilidade >= 8 && probabilidade <= 10)
				this.BonusTipo(3, false);
			else if(probabilidade >= 100 && probabilidade <= 105)
				this.BonusTipo(4, false);
			else if(probabilidade >= 120 && probabilidade <= 122)
				this.BonusTipo(5, false);
			else if(probabilidade >= 123 && probabilidade <= 125)
				this.BonusTipo(6, false);
			else if(probabilidade >= 138 && probabilidade <= 140)
				this.BonusTipo(7, false);
			else if(probabilidade >= 157 && probabilidade <= 161)
				this.BonusTipo(8, false);
		}
	},

	BonusTipo: function(tipob, pega)
	{
		if(!pega)
		{
			this.bon.push({
				x: larg-30,
				tipo: tipob,
				y: this.Linha(),
			});
		}
		else
		{
			if(tipob == 0)
				Projetil.velocidade++;
			else if(tipob == 1)
			{
				jogo = 3;
				Checa();

			}
			else if(tipob == 2)
				Projetil.limite++;
			else if(tipob == 3)
				Inimigo.velocidade++;
			else if(tipob == 4)
				Nave.vida++;
			else if(tipob == 5)
			{
				for(var i = 0; i < 10; i++)
					Emite("sine");
				Nave.vida--;
				Nave.hit = true;
			}
			else if(tipob == 6)
			{
				pontos--;
				if(pontos < 0)
					pontos = 0;
			}
			else if(tipob == 7)
			{
				pontos-=2;
				if(pontos < 0)
					pontos = 0;
			}
			else
			{
				pontos-=5;
				if(pontos < 0)
					pontos = 0;
			}

			if(Nave.vida <= 0)
			{
				jogo = 3;
				Checa();
			}
		}
	},

	Linha: function()
	{
		var pos = Math.floor(Math.random() * (5 - 1) + 1);
		switch(pos)
		{
			case 1:
				return 10;
			case 2:
				return 50;
			case 3:
				return 90;
			case 4:
				return 130;
		}
	},

	Movimenta: function()
	{
		for(var i = 0; i < this.bon.length; i++)
		{
			this.bon[i].x -= this.velocidade;
			if(this.bon[i].x <= Nave.largura)
			{
				if(this.bon[i].y == Nave.y)
				{
					this.BonusTipo(this.bon[i].tipo, true);
					Emite("triangle");
					Emite("triangle");
				}
				this.bon.splice(i, 1);
			}
		}
	},

	Desenha: function()
	{
		for(var i = 0; i < this.bon.length; i++)
		{
			if(this.bon[i].tipo == 0)
			{
				var img = new Image();
				img.src = "Bonus/bonus0.png";
				ctx.drawImage(img, this.bon[i].x, this.bon[i].y, this.largura, this.altura);
			}
			else if(this.bon[i].tipo == 1)
			{
				var img = new Image();
				img.src = "Bonus/bonus1.png";
				ctx.drawImage(img, this.bon[i].x, this.bon[i].y, this.largura, this.altura);
			}
			else if(this.bon[i].tipo == 2)
			{
				var img = new Image();
				img.src = "Bonus/bonus2.png";
				ctx.drawImage(img, this.bon[i].x, this.bon[i].y, this.largura, this.altura);
			}
			else if(this.bon[i].tipo == 3)
			{
				var img = new Image();
				img.src = "Bonus/bonus3.png";
				ctx.drawImage(img, this.bon[i].x, this.bon[i].y, this.largura, this.altura);
			}
			else if(this.bon[i].tipo == 4)
			{
				var img = new Image();
				img.src = "Bonus/bonus4.png";
				ctx.drawImage(img, this.bon[i].x, this.bon[i].y, this.largura, this.altura);
			}
			else if(this.bon[i].tipo == 5)
			{
				var img = new Image();
				img.src = "Bonus/bonus5.png";
				ctx.drawImage(img, this.bon[i].x, this.bon[i].y, this.largura, this.altura);
			}
			else if(this.bon[i].tipo == 6)
			{
				var img = new Image();
				img.src = "Bonus/bonus6.png";
				ctx.drawImage(img, this.bon[i].x, this.bon[i].y, this.largura, this.altura);
			}
			else if(this.bon[i].tipo == 7)
			{
				var img = new Image();
				img.src = "Bonus/bonus7.png";
				ctx.drawImage(img, this.bon[i].x, this.bon[i].y, this.largura, this.altura);
			}
			else if(this.bon[i].tipo == 8)
			{
				var img = new Image();
				img.src = "Bonus/bonus8.png";
				ctx.drawImage(img, this.bon[i].x, this.bon[i].y, this.largura, this.altura);
			}
		}
	}
}