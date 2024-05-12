class Snorlax {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    render () {
        var snorlaxColor = [95/255,150/255,170/255,1.0];
        var snorlaxFurColor = [241/255,229/255,215/255,0.95];
        var snorlaxFeetColor = [241/255,229/255,215/255,1.0];
        var snorlaxEyeMouthColor = [0/255,0/255,0/255,1.0];
        var snorlaxPawColor = [206/255, 194/255, 184/255, 1.0];
        var snorlaxNailColor = [255/255,255/255,255/255,1.0];
      
        var snorlaxHead = new Cube();
        snorlaxHead.matrix.translate(this.x - 8,0,this.y - 8);
        var AttachBodytoHead = new Matrix4(snorlaxHead.matrix);
        snorlaxHead.matrix.rotate(g_headAngle,0,0,1);
        snorlaxHead.matrix.scale(.8,.45,.8);
        snorlaxHead.matrix.translate(-.497,.4,.065);
        snorlaxHead.color = snorlaxColor;
        snorlaxHead.render();

        var snorlaxBody = new Cube();
        snorlaxBody.color = snorlaxColor;
        snorlaxBody.matrix = AttachBodytoHead;
        snorlaxBody.matrix.rotate(0,0,0,1);
        snorlaxBody.matrix.scale(1,1,.9);
        snorlaxBody.matrix.translate(-0.5,-.775,0);
        snorlaxBody.render();
      
        var snorlaxBodyFur = new Cube();
        snorlaxBodyFur.color = snorlaxFurColor;
        snorlaxBodyFur.matrix = new Matrix4(snorlaxBody.matrix);
        snorlaxBodyFur.matrix.rotate(0,0,0,1);
        snorlaxBodyFur.matrix.scale(.8,.9,.04);
        snorlaxBodyFur.matrix.translate(0.13,0.1,-.9);
        snorlaxBodyFur.render();
      
        var snorlaxFace = new Cube();
        snorlaxFace.color = snorlaxFurColor;
        snorlaxFace.matrix = new Matrix4(snorlaxHead.matrix);
        snorlaxFace.matrix.rotate(0,0,0,1);
        snorlaxFace.matrix.scale(.8,.93,.04);
        snorlaxFace.matrix.translate(0.14,-0.15,-.9);
        snorlaxFace.render();
      
        var snorlaxLeftEye = new Cube();
        snorlaxLeftEye.color = snorlaxEyeMouthColor;
        snorlaxLeftEye.matrix = new Matrix4(snorlaxFace.matrix);
        snorlaxLeftEye.matrix.rotate(0,0,0,1);
        snorlaxLeftEye.matrix.scale(.2,.05,.02);
        snorlaxLeftEye.matrix.translate(0.8,14,-3);
        snorlaxLeftEye.render();
      
        var snorlaxRightEye = new Cube();
        snorlaxRightEye.color = snorlaxEyeMouthColor;
        snorlaxRightEye.matrix = new Matrix4(snorlaxFace.matrix);
        snorlaxRightEye.matrix.rotate(0,0,0,1);
        snorlaxRightEye.matrix.scale(.2,.05,.02);
        snorlaxRightEye.matrix.translate(3.2,14,-3);
        snorlaxRightEye.render();
      
        var snorlaxMouth = new Cube();
        snorlaxMouth.color = snorlaxEyeMouthColor;
        snorlaxMouth.matrix = new Matrix4(snorlaxFace.matrix);
        snorlaxMouth.matrix.rotate(0,0,0,1);
        snorlaxMouth.matrix.scale(.4,.05,.02);
        snorlaxMouth.matrix.translate(.75,7,-3);
        snorlaxMouth.render();
        var snorlaxsLeftEar = new Cube();
        snorlaxsLeftEar.matrix = new Matrix4(snorlaxHead.matrix);
        snorlaxsLeftEar.matrix.rotate(g_leftEarAngle,0,0,1);
        snorlaxsLeftEar.matrix.scale(.2,.3,.2);
        snorlaxsLeftEar.matrix.translate(0.5,3.3,2);
        snorlaxsLeftEar.color = snorlaxColor;
        snorlaxsLeftEar.render();
      
        var snorlaxsRightEar = new Cube();
        snorlaxsRightEar.matrix = new Matrix4(snorlaxHead.matrix);
        snorlaxsRightEar.matrix.scale(.2,.3,.2);
        snorlaxsRightEar.matrix.translate(3.5,3.3,2);
        snorlaxsRightEar.matrix.rotate(g_rightEarAngle,0,0,1);
        snorlaxsRightEar.color = snorlaxColor;
        snorlaxsRightEar.render();
      
        var snorlaxsLeftArmJ1 = new Cube();
        snorlaxsLeftArmJ1.matrix = new Matrix4(snorlaxBody.matrix);
        snorlaxsLeftArmJ1.matrix.rotate(1,g_leftArmJoint1,0,1);
        snorlaxsLeftArmJ1.matrix.scale(.15,.25,.4);
        snorlaxsLeftArmJ1.matrix.translate(-0.8,2.5,.9);
        snorlaxsLeftArmJ1.color = snorlaxColor;
        snorlaxsLeftArmJ1.render();
      
        var snorlaxsLeftArmJ2 = new Cube();
        snorlaxsLeftArmJ2.matrix = new Matrix4(snorlaxsLeftArmJ1.matrix);
        snorlaxsLeftArmJ2.matrix.rotate(5,0,g_leftArmJoint2,1);
        snorlaxsLeftArmJ2.matrix.scale(1,1,1);
        snorlaxsLeftArmJ2.matrix.translate(-0.8,0,0);
        snorlaxsLeftArmJ2.color = snorlaxColor;
        snorlaxsLeftArmJ2.render();
      
        var snorlaxsRightArmJ1 = new Cube();
        snorlaxsRightArmJ1.matrix = new Matrix4(snorlaxBody.matrix);
        snorlaxsRightArmJ1.matrix.scale(.15,.25,.4);
        snorlaxsRightArmJ1.matrix.translate(6.66,2.5,.9);
        snorlaxsRightArmJ1.matrix.rotate(1,g_rightArmJoint1,0,1);
        snorlaxsRightArmJ1.color = snorlaxColor;
        snorlaxsRightArmJ1.render();
      
        var snorlaxsRightArmJ2 = new Cube();
        snorlaxsRightArmJ2.matrix = new Matrix4(snorlaxsRightArmJ1.matrix);
        snorlaxsRightArmJ2.matrix.scale(1,1,1);
        snorlaxsRightArmJ2.matrix.translate(0.7,0,0);
        snorlaxsRightArmJ2.matrix.rotate(-5,0,g_rightArmJoint2,1);
        snorlaxsRightArmJ2.color = snorlaxColor;
        snorlaxsRightArmJ2.render();
      
        var snorlaxsLeftClaw1 = new Cone();
        snorlaxsLeftClaw1.matrix = new Matrix4(snorlaxsLeftArmJ2.matrix);
        snorlaxsLeftClaw1.color = snorlaxNailColor;
        snorlaxsLeftClaw1.matrix.translate(-0.20,0.5,0.2);
        snorlaxsLeftClaw1.matrix.scale(1,1,1);
        snorlaxsLeftClaw1.matrix.rotate(180,1,0,1);
        snorlaxsLeftClaw1.render();
      
        var snorlaxsLeftClaw2 = new Cone();
        snorlaxsLeftClaw2.matrix = new Matrix4(snorlaxsLeftArmJ2.matrix);
        snorlaxsLeftClaw2.color = snorlaxNailColor;
        snorlaxsLeftClaw2.matrix.translate(-0.20,0.5,0.4);
        snorlaxsLeftClaw2.matrix.scale(1,1,1);
        snorlaxsLeftClaw2.matrix.rotate(180,1,0,1);
        snorlaxsLeftClaw2.render();
      
        var snorlaxsLeftClaw3 = new Cone();
        snorlaxsLeftClaw3.matrix = new Matrix4(snorlaxsLeftArmJ2.matrix);
        snorlaxsLeftClaw3.color = snorlaxNailColor;
        snorlaxsLeftClaw3.matrix.translate(-0.20,0.5,0.6);
        snorlaxsLeftClaw3.matrix.scale(1,1,1);
        snorlaxsLeftClaw3.matrix.rotate(180,1,0,1);
        snorlaxsLeftClaw3.render();
      
        var snorlaxsLeftClaw4 = new Cone();
        snorlaxsLeftClaw4.matrix = new Matrix4(snorlaxsLeftArmJ2.matrix);
        snorlaxsLeftClaw4.color = snorlaxNailColor;
        snorlaxsLeftClaw4.matrix.translate(-0.20,0.5,0.8);
        snorlaxsLeftClaw4.matrix.scale(1,1,1);
        snorlaxsLeftClaw4.matrix.rotate(180,1,0,1);
        snorlaxsLeftClaw4.render();
      
        var snorlaxsLeftClaw5 = new Cone();
        snorlaxsLeftClaw5.matrix = new Matrix4(snorlaxsLeftArmJ2.matrix);
        snorlaxsLeftClaw5.color = snorlaxNailColor;
        snorlaxsLeftClaw5.matrix.translate(-0.20,0.5,1);
        snorlaxsLeftClaw5.matrix.scale(1,1,1);
        snorlaxsLeftClaw5.matrix.rotate(180,1,0,1);
        snorlaxsLeftClaw5.render();
      
        var snorlaxsRightClaw1 = new Cone();
        snorlaxsRightClaw1.matrix = new Matrix4(snorlaxsRightArmJ2.matrix);
        snorlaxsRightClaw1.color = snorlaxNailColor;
        snorlaxsRightClaw1.matrix.translate(1.20,.5,0.2);
        snorlaxsRightClaw1.matrix.scale(1,1,1);
        snorlaxsRightClaw1.matrix.rotate(270,0,1,0);
        snorlaxsRightClaw1.render();
      
        var snorlaxsRightClaw2 = new Cone();
        snorlaxsRightClaw2.matrix = new Matrix4(snorlaxsRightArmJ2.matrix);
        snorlaxsRightClaw2.color = snorlaxNailColor;
        snorlaxsRightClaw2.matrix.translate(1.20,.5,0.4);
        snorlaxsRightClaw2.matrix.scale(1,1,1);
        snorlaxsRightClaw2.matrix.rotate(270,0,1,0);
        snorlaxsRightClaw2.render();
      
        var snorlaxsRightClaw3 = new Cone();
        snorlaxsRightClaw3.matrix = new Matrix4(snorlaxsRightArmJ2.matrix);
        snorlaxsRightClaw3.color = snorlaxNailColor;
        snorlaxsRightClaw3.matrix.translate(1.20,.5,0.6);
        snorlaxsRightClaw3.matrix.scale(1,1,1);
        snorlaxsRightClaw3.matrix.rotate(270,0,1,0);
        snorlaxsRightClaw3.render();
      
        var snorlaxsRightClaw4 = new Cone();
        snorlaxsRightClaw4.matrix = new Matrix4(snorlaxsRightArmJ2.matrix);
        snorlaxsRightClaw4.color = snorlaxNailColor;
        snorlaxsRightClaw4.matrix.translate(1.20,.5,0.8);
        snorlaxsRightClaw4.matrix.scale(1,1,1);
        snorlaxsRightClaw4.matrix.rotate(270,0,1,0);
        snorlaxsRightClaw4.render();
      
        var snorlaxsRightClaw5 = new Cone();
        snorlaxsRightClaw5.matrix = new Matrix4(snorlaxsRightArmJ2.matrix);
        snorlaxsRightClaw5.color = snorlaxNailColor;
        snorlaxsRightClaw5.matrix.translate(1.20,.5,1);
        snorlaxsRightClaw5.matrix.scale(1,1,1);
        snorlaxsRightClaw5.matrix.rotate(270,0,1,0);
        snorlaxsRightClaw5.render();
        
        var snorlaxsLeftFoot = new Cube();
        snorlaxsLeftFoot.matrix = new Matrix4(snorlaxBody.matrix);
        snorlaxsLeftFoot.matrix.rotate(g_leftFootAngle,0,0,1);
        snorlaxsLeftFoot.matrix.scale(.33,.33,.2);
        snorlaxsLeftFoot.matrix.translate(0,.005,-1);
        snorlaxsLeftFoot.color = snorlaxFeetColor;
        snorlaxsLeftFoot.render();
      
        var snorlaxsLFLeftToe = new Cube();
        snorlaxsLFLeftToe.matrix = new Matrix4(snorlaxsLeftFoot.matrix);
        snorlaxsLFLeftToe.matrix.rotate(0,0,0,1);
        snorlaxsLFLeftToe.matrix.scale(.2,.2,.2);
        snorlaxsLFLeftToe.matrix.translate(.5,5,0);
        snorlaxsLFLeftToe.color = snorlaxNailColor;
        snorlaxsLFLeftToe.render();
      
        var snorlaxsLFMiddleToe = new Cube();
        snorlaxsLFMiddleToe.matrix = new Matrix4(snorlaxsLeftFoot.matrix);
        snorlaxsLFMiddleToe.matrix.rotate(0,0,0,1);
        snorlaxsLFMiddleToe.matrix.scale(.2,.2,.2);
        snorlaxsLFMiddleToe.matrix.translate(2.1,5,0);
        snorlaxsLFMiddleToe.color = snorlaxNailColor;
        snorlaxsLFMiddleToe.render();
      
        var snorlaxsLFRightToe = new Cube();
        snorlaxsLFRightToe.matrix = new Matrix4(snorlaxsLeftFoot.matrix);
        snorlaxsLFRightToe.matrix.rotate(0,0,0,1);
        snorlaxsLFRightToe.matrix.scale(.2,.2,.2);
        snorlaxsLFRightToe.matrix.translate(3.66,5,0);
        snorlaxsLFRightToe.color = snorlaxNailColor;
        snorlaxsLFRightToe.render();
      
        var snorlaxsRightFoot = new Cube();
        snorlaxsRightFoot.matrix = new Matrix4(snorlaxBody.matrix);
        snorlaxsRightFoot.matrix.scale(.33,.33,.2);
        snorlaxsRightFoot.matrix.translate(2.05,.005,-1);
        snorlaxsRightFoot.matrix.rotate(g_rightFootAngle,0,0,1);
        snorlaxsRightFoot.color = snorlaxFeetColor;
        snorlaxsRightFoot.render();
      
        var snorlaxsRFLeftToe = new Cube();
        snorlaxsRFLeftToe.matrix = new Matrix4(snorlaxsRightFoot.matrix);
        snorlaxsRFLeftToe.matrix.rotate(0,0,0,1);
        snorlaxsRFLeftToe.matrix.scale(.2,.2,.2);
        snorlaxsRFLeftToe.matrix.translate(.5,5,0);
        snorlaxsRFLeftToe.color = snorlaxNailColor;
        snorlaxsRFLeftToe.render();
      
        var snorlaxsRFMiddleToe = new Cube();
        snorlaxsRFMiddleToe.matrix = new Matrix4(snorlaxsRightFoot.matrix);
        snorlaxsRFMiddleToe.matrix.rotate(0,0,0,1);
        snorlaxsRFMiddleToe.matrix.scale(.2,.2,.2);
        snorlaxsRFMiddleToe.matrix.translate(2.1,5,0);
        snorlaxsRFMiddleToe.color = snorlaxNailColor;
        snorlaxsRFMiddleToe.render();
      
        var snorlaxsRFRightToe = new Cube();
        snorlaxsRFRightToe.matrix = new Matrix4(snorlaxsRightFoot.matrix);
        snorlaxsRFRightToe.matrix.rotate(0,0,0,1);
        snorlaxsRFRightToe.matrix.scale(.2,.2,.2);
        snorlaxsRFRightToe.matrix.translate(3.66,5,0);
        snorlaxsRFRightToe.color = snorlaxNailColor;
        snorlaxsRFRightToe.render();
      
        var snorlaxsRightPaw = new Cube();
        snorlaxsRightPaw.matrix = new Matrix4(snorlaxsRightFoot.matrix);
        snorlaxsRightPaw.matrix.rotate(0,0,0,1);
        snorlaxsRightPaw.matrix.scale(.65,.5,.2);
        snorlaxsRightPaw.matrix.translate(0.275,.15,-1);
        snorlaxsRightPaw.color = snorlaxPawColor;
        snorlaxsRightPaw.render();
      
        var snorlaxsLeftPaw = new Cube();
        snorlaxsLeftPaw.matrix = new Matrix4(snorlaxsLeftFoot.matrix);
        snorlaxsLeftPaw.matrix.rotate(0,0,0,1);
        snorlaxsLeftPaw.matrix.scale(.65,.5,.2);
        snorlaxsLeftPaw.matrix.translate(0.275,.15,-1);
        snorlaxsLeftPaw.color = snorlaxPawColor;
        snorlaxsLeftPaw.render();
    }
}