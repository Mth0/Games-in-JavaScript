let gravidade = 1;
let pontos = cenarioValor = 0;
let jogo = 0;
let m1 = m2 = m3 = 0;
let aux = false;
let corFundo = "black";
let corDown = "white";
let canvas;
let puloSom;
let introSom;
let fundo;
let gameOverSom;
let morto = false;
let mov = false;
let trocaSprite = 10;


function preload()
{
	soundFormats("mp3", "ogg");
	puloSom = loadSound("som/jump.mp3");
	introSom = loadSound("som/intro2.mp3");
	gameOverSom = loadSound("som/gameOver.mp3");
	bloco.img = loadImage("textura/gota.png");
	bloco.img2 = loadImage("textura/gota4.png");
	bloco.imgAr = loadImage("textura/gota2.png");
	bloco.imgMorto = loadImage("textura/gota3.png");
	fundo = loadImage("textura/fundo2.png");	
}
function setup()
{
	canvas = createCanvas(800, 600);
	canvas.id('cnv');
	textFont("Float");
	frameRate(120);

	puloSom.setVolume(0.8);
	gameOverSom.setVolume(0.4);
	introSom.setVolume(0.5);
	introSom.setLoop(true);
}
function draw()
{
	image(fundo, 0,0,width, height);
	fill(corDown);
	textSize(50);

	if(jogo === 0)
	{
		textSize(80);
		if((cenarioValor >= 21 && cenarioValor < 31) || (cenarioValor >= 41 && cenarioValor < 51))
			fill("#fff");
		text("JUMPER", width/2-100, height/2-20);
	}
	else if(jogo === 2 && bloco.y > height)
	{
		clear();
		background(corFundo);
		fill(corDown);
		text("Recordes: ", width/2-100, 100);
		if(pontos > m1 && !aux)
		{
			aux = true;
			m1 = pontos;
		}
		else if(pontos > m2 && !aux)
		{
			aux = true;
			m2 = pontos;
		}
		else if(pontos > m3 && !aux)
		{
			aux = true;
			m3 = pontos;
		}

		if(m1 > 0)
			text("1°: " + m1, 30, 300);
		if(m2 > 0)
			text("2°: " + m2, 30, 400);
		if(m3 > 0)
			text("3°: " + m3, 30, 500);
	}
	else if(jogo === 3)
	{
		chao.Pinta();
		bloco.Desenha();
		obstaculo.Desenha();
		text("PAUSE", width/2-50, height/2);
	}
	else
	{
		chao.Pinta();
		bloco.Atualiza();
		bloco.Desenha();
		obstaculo.Gera();
		obstaculo.Movimenta();
		obstaculo.Desenha();
		Colide();
		if(pontos < 10)
			text(pontos, width/2, 50);
		else if(pontos < 100)
			text(pontos, width/2-10, 50);
		else
			text(pontos, width/2-20, 50);
	}
	Cenario();
}
function mousePressed()
{
	if(!introSom.isPlaying())
		introSom.play();
	if(jogo === 0)
	{
		cenarioValor = 0;
		jogo = 1;
	}

	else if(jogo === 1){
		if(bloco.pulo < 3)
		{
			bloco.Pula();
			puloSom.play();
		}
	}
	else if(jogo!==3)
	{
		Reseta();
	}
}
function keyPressed()
{
	if(!introSom.isPlaying())
		introSom.play();
	if(keyCode === 80)
	{
		if(jogo === 1)
			jogo = 3;
		else if(jogo === 3)
			jogo = 1;
	}
	if(keyCode === ENTER || keyCode === 32)
	{
		if(jogo === 1)
			jogo=3;
		else if(jogo === 2)
			Reseta();
		else if(jogo === 3)
			jogo = 1;
		else if(jogo === 0)
		{
			jogo = 1;
			cenarioValor = 0;
		}
	}
}
function Reseta()
{
	obstaculo.velocidade = 5;
	obstaculo.obst = [];
	pontos = 0;
	jogo = 0;
	bloco.y = 50;
	bloco.velocidade = 0;
	aux = false;
	morto = false;
}
function Colide()
{
	for(var i = 0; i < obstaculo.obst.length; i++)
	{
		if(obstaculo.obst[i].x <= bloco.largura && obstaculo.obst[i].y-30 <= bloco.y)
		{
			jogo = 2;
			obstaculo.velocidade = 0;
			if(!gameOverSom.isPlaying())
			{
				introSom.stop();
				gameOverSom.play();
			}
			morto = true;
		}
	}
}
function Cenario()
{
	if(cenarioValor === 0)
	{
		corFundo = "#000";
		corDown = "#fff";
		$("#cnv").css({"border-color":corDown});
		bloco.cor = obstaculo.cor = corDown;
	}

	else if(cenarioValor === 11)
	{
		corDown = "#ff0000";
		$("#cnv").css({"border-color":corDown});
		bloco.cor = obstaculo.cor = corDown;
	}
	else if(cenarioValor === 21)
	{
		corDown = "#0000ff";
		$("#cnv").css({"border-color":corDown});
		bloco.cor = obstaculo.cor = corDown;
	}
	else if(cenarioValor === 31)
	{
		corDown = "#ffff00";
		$("#cnv").css({"border-color":corDown});
		bloco.cor = obstaculo.cor = corDown;
	}
	else if(cenarioValor === 41)
	{
		corDown = "#800080";
		$("#cnv").css({"border-color":corDown});
		bloco.cor = obstaculo.cor = corDown;
	}
	else if(cenarioValor === 51)
		cenarioValor = 0;
}