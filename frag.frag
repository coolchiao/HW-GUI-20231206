#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// Part 2 - Step 1
// from here
uniform float u_xBrickAmount;
uniform float u_yBrickAmount;
// to here

uniform sampler2D u_texBase;

//計算光暈效果 d代表距離值，str代表強度值，thickness代表厚度值
float glow(float d, float str, float thickness){
    return thickness / pow(d, str);
}

//定義矩形：
float square(vec2 P, float size){
    return max(abs(P.x), abs(P.y)) - size/(1.0);
}

//定義隨機
float random (vec2 st){
    return fract(sin(dot(st.xy, vec2(12.0898, 78.233)))*43758.345);
}

//定義旋轉
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}

void main() {
    //定義宮格重覆繪製
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = fract(uv*50.0);
    uv = uv*2.0-1.0;

    //矩形重覆
    float col = 0.0;
    for (int i=0; i<6; i++){
        float border = random(vec2(float(i), 0.888))*0.8;
        vec2 new_uv = uv*rotate2d(random(vec2(float(i), 1.0))*u_time*3.14);
        float squareUV = square(new_uv, border);
        float glowSquare = glow(squareUV, 0.508, 0.016);
        col += glowSquare;
    }

    //原本的矩形繪製部分
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    vec2 brickAmount = vec2(u_xBrickAmount, u_yBrickAmount);
    
    vec2 stAdjustedByBrickAmount = st * brickAmount;
    vec2 integerCoordinate = floor(stAdjustedByBrickAmount); // get the integer coords
    vec2 fractionalCoordinate = fract(stAdjustedByBrickAmount); // get the fractional coords
    vec2 mosaic = integerCoordinate / brickAmount;
    
    vec3 color = vec3(0.0);
    color = texture2D(u_texBase, mosaic).rgb;

    //整合兩部分的結果
    gl_FragColor = vec4(col * color, 1.0);
}