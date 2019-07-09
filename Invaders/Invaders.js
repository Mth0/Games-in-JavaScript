//Mon-day - hey; Kupla - Tiger
var tela = document.getElementById('tela');
var m1 = m2 = m3 = auxp = jogo = posMenu = frames = pontos = 0;
var nome1 = nome2 = nome3 = "";
//Obtém os valores de largura e altura da tela<canvas>
var larg = tela.width;
var alt = tela.height;
var morto = gameOver = false;

//cria um novo contexto de audio
let somCtx = new AudioContext();

//cria o contexto do jogo
ctx = tela.getContext("2d");

//reconhece eventos de tecla
document.addEventListener("keyup", function Tecla(event){
	//move nave ou a opção do menu pra baixo
	if(event.key == "ArrowDown")
	{
		if(jogo == 1)
			Nave.Movimenta(0);
		else if(jogo == 3)
		{
			posMenu++;
			if(posMenu > 2)
				posMenu = 1;
			Estatico();
		}
	}
	//move nave ou a opção do menu pra cima
	else if(event.key == "ArrowUp")
	{
		if(jogo == 1)
			Nave.Movimenta(1);
		else if(jogo == 3)
		{
			posMenu--;
			if(posMenu < 1)
				posMenu = 2;
			Estatico();
		}
	}
	//volta para a tela principal e inicia o jogo
	else if((event.key == "Enter" || event.key == " ") && (jogo == 2 || jogo == 0))
	{
		if(jogo == 0)
		{
			jogo = 1;
			Inimigo.velocidade = 5;
		}
		else
		{
			jogo = 0;
			TelaInicial();
		}	
	}
	//gera projéteis da nave
	else if((event.key == "a" || event.key == "A" || event.key == " ") && jogo == 1)// == " "
		Projetil.Gera();
	//pausa de despausa o jogo
	else if((event.key == "p" || event.key == "P" || event.key == "Enter") && (jogo == 1 || jogo == 3))
	{
		if(posMenu == 1 || posMenu == 0)
		{
			if(posMenu == 0)
				posMenu = 1;
			else
				posMenu	= 0;
			Estatico();
		}
		else if(posMenu == 2)
		{
			posMenu	= 0;
			jogo = 0;
			TelaInicial();	
		}
		// else if(posMenu == 3)
		// {
		// 	posMenu = 3;
		// 	Estatico();
		// }
	}
});
//inútil... não mais
function Main()
{
	if(jogo == 0)
		TelaInicial();
	if(jogo == 1)
		Executa();
	window.requestAnimationFrame(Main);
}
//executa e atualiza o jogo
function Executa()
{
	if(jogo == 1)
	{
		Inimigo.Atualiza();
		Inimigo.Movimenta();
		Projetil.Locomove();
		ProjetilInimigo.Locomove();
		Bonus.Verifica();
		Bonus.Movimenta();
		Desenha();

	}
	Checa();
}
//desenha os elementos do jogo
function Desenha()
{
	//pinta o fundo
	if(pontos >= 10 && pontos <= 14)
	{
		Inimigo.velocidade = 6;
		Inimigo.limit = 45;
		ProjetilInimigo.velocidade = 8;
		var img2 = new Image();
		img2.src = "Fundos/bck1.png";
		ctx.drawImage(img2, 0, 0, larg, alt);
	}

	else if(pontos >= 30 && pontos <= 34)
	{
		Inimigo.velocidade = 7;
		Inimigo.limit = 39;
		Projetil.velocidade = 8;
		var img2 = new Image();
		img2.src = "Fundos/bck1.png";
		ctx.drawImage(img2, 0, 0, larg, alt);
	}

	else if(pontos >= 50 && pontos <= 54)
	{
		Inimigo.velocidade = 8;
		Inimigo.limit = 34;
		ProjetilInimigo.velocidade = 10;
		var img2 = new Image();
		img2.src = "Fundos/bck1.png";
		ctx.drawImage(img2, 0, 0, larg, alt);
	}

	else if(pontos >= 70 && pontos <= 74)
	{
		Inimigo.velocidade = 9;
		Inimigo.limit = 30;
		Projetil.velocidade = 9;
		var img2 = new Image();
		img2.src = "Fundos/bck1.png";
		ctx.drawImage(img2, 0, 0, larg, alt);
	}

	else if(pontos >= 90 && pontos <= 94)
	{
		Inimigo.velocidade = 10;
		Inimigo.limit = 27;
		ProjetilInimigo.velocidade = 12;
		var img2 = new Image();
		img2.src = "Fundos/bck1.png";
		ctx.drawImage(img2, 0, 0, larg, alt);
	}
	else
	{
		var img2 = new Image();
		img2.src = "Fundos/bck2.png";
		ctx.drawImage(img2, 0, 0, larg, alt);
	}

	// ctx.fillStyle = "#000";
	// ctx.fillRect(0, 0, larg, alt);
	//pinta os objetos
	Nave.Desenha();
	Inimigo.Desenha();
	Projetil.Desenha();
	ProjetilInimigo.Desenha();
	Bonus.Desenha();

	ctx.fillStyle = "#fff";
	ctx.font = "15px Float";
	ctx.fillText(pontos, 3, 10);
}
//emite sons
function Emite(type)
{
	osc = somCtx.createOscillator();//cria um oscilador
	ganho = somCtx.createGain();//cria um novo ganho(?)
	osc.type = type;//define o tipo de oscilação
	osc.connect(ganho);//conecta a oscilação ao ganho
	ganho .connect(somCtx.destination);//conecta o ganho à saída de vídeo
	osc.start(0);//inicia a oscilação com 0

	//determina, grosseiramente falando, o tempo do audio
	ganho.gain.exponentialRampToValueAtTime(0.00001, somCtx.currentTime + 1);
}
//gerencia as escritas, logos e pontuações do jogo
function Checa()
{
	if(jogo == 2)
	{
		Inimigo.ini = [];
		ProjetilInimigo.proj = [];
		Bonus.bon = [];
		Inimigo.velocidade = 0;

		var img3 = new Image();
		img3.src = "Fundos/bck2.png";
		ctx.drawImage(img3, 0, 0, larg, alt);
		// ctx.fillStyle = "#000";
		// ctx.fillRect(0, 0, larg, alt);

		ctx.fillStyle = "#fff";
		ctx.font = "30px Float";
		if(pontos < 10)
			ctx.fillText(pontos, larg/2-10, alt/2-20);
		else if(pontos < 100)
			ctx.fillText(pontos, larg/2-15, alt/2-20);
		else if(pontos < 1000)
			ctx.fillText(pontos, larg/2-20, alt/2-20);

		if(pontos > m1)
		{
			if(m2 == 0)
			{
				m2 = m1;
				nome2 = nome1;
			}
			m1 = pontos;
			nome1 = prompt("Parabéns, você fez um novo recorde!").toUpperCase();
			// if(nome1 == null || nome1=="")
			// 	nome1= "Snome";
			auxp = 1;
		}
		else if(pontos > m2 && auxp != 1)
		{
			if(m3 == 0)
			{
				m3 = m2;
				nome3 = nome2;
			}
			m2 = pontos;
			nome2 = prompt("Parabéns, você fez um novo recorde!").toUpperCase();
			// if(nome2 == null || nome2=="")
			// 	nome2= "Snome";
			auxp = 1;
		}
		else if(pontos > m3 && auxp != 1)
		{
			m3 = pontos;
			nome3 = prompt("Parabéns, você fez um novo recorde!").toUpperCase();
			// if(nome3 == null || nome3=="")
			// 	nome3 = "Snome";
			auxp = 1;
		}

		ctx.fillStyle = "lightgreen";
		ctx.font = "20px Float";
		ctx.fillText("Recordes: ", 30, 80);
		ctx.fillStyle = "gold";
		if(m1 > 0)
			ctx.fillText("1° " + m1 + "(" + nome1 + ")", 30, 100);
		ctx.fillStyle = "silver";
		if(m2 > 0)
			ctx.fillText("2° " + m2 + "(" + nome2 + ")", 30, 120);
		ctx.fillStyle = "#fff";
		if(m3 > 0)
			ctx.fillText("3° " + m3 + "(" + nome3 + ")", 30, 140);
	}

	else if(jogo == 3)
	{
		ctx.fillStyle = "#fff";
		ctx.font = "30px Float";
		ctx.fillText("GAME OVER", larg/2-50, alt/2+5);
		morto = gameOver = true;
	}
}
//imprime a tela inicial
function TelaInicial()
{
	var img = new Image();
	img.src = "Fundos/bck1.png";
	ctx.drawImage(img, 0, 0, larg, alt);
	// ctx.fillStyle = "#000";
	// ctx.fillRect(0, 0, larg, alt);

	ctx.fillStyle = "#fff";
	ctx.font = "50px Float";
	ctx.fillText("invaders", 78, 75);
	Nave.hitTempo = pontos = auxp = posMenu = 0;
	Nave.vida = 2;
	Nave.hit = gameOver = morto = false;
}
//controla os momentos estáticos, parados do jogo
function Estatico()
{
	if((jogo == 1 || jogo == 3) && posMenu != 0 && !gameOver)
	{
		Desenha();
		jogo = 3;
		ctx.fillStyle = "#fff";
		ctx.font = "40px Float";
		ctx.fillText("PAUSE", larg/2-45, alt/2-30);
		ctx.font = "20px Float";
		if(posMenu == 1)
		{
			ctx.fillStyle = "yellow";
			ctx.fillText("RETURN", larg/2-35, alt/2);
			ctx.fillStyle = "#fff";
			ctx.fillText("RETRY", larg/2-35, alt/2+30);
			// ctx.fillText("CONTROLS", larg/2-35, alt/2+60);
		}
		else if(posMenu == 2)
		{
			ctx.fillStyle = "yellow";
			ctx.fillText("RETRY", larg/2-35, alt/2+30);
			ctx.fillStyle = "#fff";
			ctx.fillText("RETURN", larg/2-35, alt/2);
			// ctx.fillText("CONTROLS", larg/2-35, alt/2+60);
		}
		// else if(posMenu == 3)
		// {
		// 	ctx.fillStyle = "yellow";
		// 	ctx.fillText("CONTROLS", larg/2-35, alt/2+60);	
		// 	ctx.fillStyle = "#fff";
		// 	ctx.fillText("RETURN", larg/2-35, alt/2);
		// 	ctx.fillText("RETRY", larg/2-35, alt/2+30);
			
		// }
	}
	else if(morto)
	{
		jogo = 2;
		Checa();
	}
	else if(posMenu	== 0)
	{
		jogo = 1;
		posMenu	= 0;
	}
}
Main();