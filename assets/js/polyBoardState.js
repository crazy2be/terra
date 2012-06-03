/// <reference path="http://code.jquery.com/jquery-1.4.1-vsdoc.js" />
/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js"></script>
/// <reference path="https://raw.github.com/caleb531/jcanvas/master/builds/5.2.1/jcanvas.js"></script>

        //merged to with jQuery.extend on every return from every call to server
var boardState = {
	"Players" : {
		1: {
			//"color" : "blue"
		}
		//,...
		//All players are returned here
	},

	//Present:
		//?????
	//Restrictions:
		//All territory references use indices of array itself, 
		//and continents use indices of continent array (???)
		//players use indeces of Players array
	"Territories" : {
		 "0": {"Connections": [40, 2, 1],
			"Continent": 1,
			"Owner": 1,
			"Men": 5,			

			//Client side
			"Coords" : [721, 296, 722, 293, 735, 242, 737, 222, 734, 217, 720, 202],
			"CenterLocation": {x : 692.0067, y : 190.1809},
			"SelectState" : "selected",
            "Mouseover" : false
			},
		

	},

	//Present:
		//Always
	"Turn" : {		
		"Player" :  1,
		"Stage": "placing",// "attacking",

        //Client side
        "State" : "waiting", //"attackdice", //movechoose, advancingtomove
		"MenLeft": 44
	},
    
	//Present:
		//Always when needed               
	"Extra" : {    
		//Present:
			//Dice are filled in right after an attack call
		//Restrictions:
			//Client:
				//Dice are any quantity and type anything, as long as I know in advance how the server
				//handles to result, I can duplicate any result.
			//Server:
				//?????
		"Attacker's Dice" : [1, 2, 5],
		"Defender's Dice": [5, 4]
	},

    
	//Client side additions:
    "PromptBox" : {        
        "result" : "yes", //"cancel"        
        "callback" : function(input) { alert("fill in callback! data though is:" + input); }
    }
    
};              

        var terrClickData = {
"Territories": {	"0" : { 		"CenterLocation": {x : 678.8397, y : 247.6586},
		"Coords": [721, 296, 722, 293, 724, 289, 725, 285, 726, 282, 727, 280, 727, 273, 727, 272, 727, 266, 727, 261, 728, 258, 710, 253, 711, 249, 708, 246, 707, 243, 706, 241, 701, 234, 695, 231, 691, 230, 691, 226, 675, 219, 674, 218, 672, 213, 663, 212, 660, 209, 649, 212, 649, 216, 639, 220, 636, 214, 627, 229, 637, 234, 643, 255, 648, 264, 655, 265, 656, 261, 659, 259, 661, 259, 663, 263, 663, 265, 665, 268, 667, 270, 673, 270, 675, 271, 677, 266, 680, 265, 680, 271, 687, 271, 689, 268, 695, 268, 699, 271, 703, 275, 705, 276, 707, 277, 707, 279, 709, 283, 709, 289, 712, 291, 715, 293, 717, 293, 721, 296]
		}, 
	"1" : { 		"CenterLocation": {x : 692.0067, y : 190.1809},
		"Coords": [727, 257, 730, 244, 735, 242, 737, 222, 734, 217, 720, 202, 715, 190, 718, 184, 719, 178, 719, 171, 686, 138, 672, 136, 668, 133, 667, 132, 660, 128, 655, 124, 646, 134, 649, 139, 651, 152, 656, 155, 659, 157, 660, 208, 664, 213, 673, 212, 675, 220, 691, 225, 691, 230, 698, 233, 710, 245, 710, 253, 723, 256, 727, 258]
		}, 
	"2" : { 		"CenterLocation": {x : 626.6915, y : 178.5222},
		"Coords": [636, 215, 638, 220, 649, 215, 649, 211, 660, 208, 658, 158, 650, 150, 649, 139, 644, 134, 653, 124, 648, 118, 642, 117, 637, 118, 635, 120, 633, 121, 631, 125, 628, 126, 625, 127, 624, 129, 623, 133, 622, 134, 621, 139, 620, 141, 618, 143, 614, 146, 612, 148, 611, 150, 608, 151, 607, 158, 602, 162, 602, 168, 590, 175, 590, 192, 583, 192, 588, 210, 606, 220, 610, 218, 626, 228, 636, 215]
		}, 
	"3" : { 		"CenterLocation": {x : 568.8756, y : 140.28},
		"Coords": [584, 193, 592, 193, 590, 179, 591, 174, 602, 168, 601, 161, 606, 160, 606, 154, 610, 146, 609, 139, 611, 133, 606, 123, 610, 120, 619, 113, 609, 109, 601, 110, 597, 111, 588, 114, 575, 116, 555, 113, 540, 111, 513, 126, 509, 136, 519, 142, 521, 149, 535, 150, 542, 149, 547, 154, 554, 157, 558, 158, 562, 170, 577, 174, 583, 192]
		}, 
	"4" : { 		"CenterLocation": {x : 510.857, y : 59.65554},
		"Coords": [499, 109, 525, 94, 525, 82, 519, 82, 518, 77, 519, 73, 523, 71, 522, 67, 536, 62, 541, 62, 550, 64, 554, 66, 556, 67, 557, 64, 553, 56, 560, 56, 565, 54, 568, 54, 571, 54, 573, 53, 574, 49, 579, 46, 549, 28, 513, 22, 495, 24, 498, 33, 496, 41, 494, 48, 487, 49, 482, 51, 479, 55, 456, 58, 453, 58, 448, 59, 450, 74, 467, 82, 471, 82, 477, 84, 484, 87, 488, 87, 494, 104, 495, 109]
		}, 
	"5" : { 		"CenterLocation": {x : 452.0753, y : 38.1629},
		"Coords": [451, 58, 477, 56, 476, 47, 479, 45, 483, 45, 487, 45, 491, 43, 490, 40, 487, 37, 486, 34, 486, 30, 486, 26, 477, 23, 471, 23, 466, 20, 426, 24, 420, 26, 419, 28, 415, 29, 415, 36, 415, 43, 419, 47, 427, 54, 438, 47, 440, 53, 451, 58]
		}, 
	"6" : { 		"CenterLocation": {x : 397.3286, y : 55.10504},
		"Coords": [437, 84, 450, 74, 447, 56, 437, 56, 439, 48, 423, 54, 414, 42, 413, 32, 419, 23, 405, 23, 397, 25, 371, 23, 370, 26, 355, 46, 362, 59, 357, 69, 368, 85, 387, 80, 403, 72, 430, 80, 438, 85]
		}, 
	"7" : { 		"CenterLocation": {x : 259.5282, y : 123.5657},
		"Coords": [308, 171, 303, 137, 308, 123, 314, 110, 303, 101, 292, 91, 272, 87, 252, 84, 236, 87, 224, 93, 203, 101, 195, 107, 198, 123, 203, 133, 209, 139, 223, 139, 234, 140, 242, 150, 252, 162, 259, 163, 279, 163, 281, 168, 307, 171]
		}, 
	"8" : { 		"CenterLocation": {x : 268.6348, y : 240.0556},
		"Coords": [310, 186, 337, 218, 326, 229, 316, 240, 313, 249, 307, 250, 272, 254, 250, 292, 235, 292, 221, 277, 208, 270, 205, 247, 228, 233, 243, 227, 257, 221, 277, 212, 288, 199, 311, 187]
		}, 
	"9" : { 		"CenterLocation": {x : 258.015, y : 186.7438},
		"Coords": [311, 188, 306, 172, 286, 172, 268, 162, 247, 161, 221, 142, 223, 187, 230, 189, 233, 221, 236, 231, 312, 188]
		}, 
	"10" : { 		"CenterLocation": {x : 196.8271, y : 174.2406},
		"Coords": [217, 241, 234, 229, 226, 188, 221, 182, 221, 143, 184, 136, 174, 116, 164, 115, 165, 150, 153, 171, 167, 183, 183, 184, 193, 191, 195, 196, 198, 214, 211, 221, 215, 241, 235, 229]
		}, 
	"11" : { 		"CenterLocation": {x : 108.806, y : 136.3751},
		"Coords": [163, 116, 162, 156, 151, 171, 139, 177, 122, 160, 116, 164, 111, 158, 104, 160, 92, 158, 81, 144, 79, 136, 70, 141, 62, 140, 24, 144, 35, 126, 54, 117, 71, 113, 94, 110, 117, 112, 141, 115, 164, 115]
		}, 
	"12" : { 		"CenterLocation": {x : 176.8026, y : 225.0891},
		"Coords": [138, 177, 144, 194, 148, 206, 150, 215, 150, 225, 145, 233, 153, 241, 159, 257, 166, 269, 172, 274, 182, 264, 189, 271, 204, 273, 208, 273, 205, 249, 214, 242, 209, 217, 201, 214, 194, 197, 184, 185, 176, 181, 165, 179, 151, 174, 138, 182]
		}, 
	"13" : { 		"CenterLocation": {x : 110.3082, y : 189.3688},
		"Coords": [139, 228, 128, 199, 120, 183, 117, 167, 119, 163, 111, 159, 97, 160, 83, 163, 86, 180, 95, 191, 103, 201, 117, 219, 126, 226, 141, 229]
		}, 
	"14" : { 		"CenterLocation": {x : 101.8936, y : 513.1229},
		"Coords": [131, 555, 114, 515, 115, 501, 107, 494, 99, 474, 91, 469, 79, 465, 78, 465, 78, 479, 82, 489, 86, 503, 88, 517, 92, 529, 96, 539, 103, 549, 110, 552, 123, 557, 131, 557]
		}, 
	"15" : { 		"CenterLocation": {x : 86.12231, y : 349.9218},
		"Coords": [121, 387, 116, 378, 124, 375, 126, 367, 115, 363, 119, 357, 120, 356, 124, 348, 119, 340, 125, 298, 103, 290, 95, 300, 79, 307, 63, 319, 58, 330, 50, 346, 43, 360, 42, 378, 45, 396, 51, 406, 56, 406, 69, 388, 92, 389, 99, 396, 119, 387]
		}, 
	"16" : { 		"CenterLocation": {x : 111.5724, y : 420.0417},
		"Coords": [123, 463, 138, 464, 147, 472, 151, 459, 147, 396, 136, 389, 133, 393, 127, 390, 120, 387, 112, 387, 102, 392, 95, 393, 88, 390, 80, 387, 69, 390, 63, 395, 60, 403, 59, 410, 61, 416, 66, 426, 70, 431, 81, 434, 94, 434, 110, 439, 115, 445, 122, 457, 124, 463, 133, 467, 149, 470]
		}, 
	"17" : { 		"CenterLocation": {x : 159.965, y : 517.0501},
		"Coords": [192, 579, 191, 544, 184, 540, 183, 498, 186, 496, 176, 486, 170, 486, 165, 482, 161, 477, 155, 474, 148, 469, 142, 466, 137, 463, 122, 465, 123, 477, 129, 490, 133, 505, 132, 516, 144, 533, 147, 543, 176, 575, 192, 580]
		}, 
	"18" : { 		"CenterLocation": {x : 214.1922, y : 520.9923},
		"Coords": [192, 580, 200, 577, 210, 569, 240, 538, 244, 536, 246, 526, 236, 504, 240, 490, 247, 486, 244, 477, 241, 477, 241, 470, 232, 470, 225, 471, 221, 476, 211, 485, 206, 490, 194, 491, 194, 497, 185, 499, 184, 539, 193, 546, 193, 579]
		}, 
	"19" : { 		"CenterLocation": {x : 174.3481, y : 452.5156},
		"Coords": [186, 500, 193, 498, 195, 492, 203, 490, 205, 481, 202, 481, 200, 474, 205, 473, 201, 464, 197, 459, 195, 452, 195, 448, 196, 443, 192, 438, 188, 434, 183, 426, 182, 418, 181, 414, 180, 410, 162, 411, 156, 408, 151, 407, 149, 448, 152, 455, 153, 464, 148, 468, 150, 473, 158, 477, 166, 477, 172, 486, 177, 488, 182, 490, 184, 495, 186, 498, 193, 499]
		}, 
	"20" : { 		"CenterLocation": {x : 168.5697, y : 346.7278},
		"Coords": [173, 285, 162, 288, 129, 303, 124, 308, 122, 329, 122, 343, 124, 347, 124, 352, 120, 356, 118, 358, 122, 361, 124, 365, 126, 369, 126, 374, 121, 376, 120, 377, 120, 381, 122, 387, 124, 390, 130, 390, 138, 390, 140, 391, 143, 392, 146, 395, 150, 397, 152, 402, 150, 408, 157, 408, 163, 408, 178, 410, 183, 404, 194, 398, 204, 397, 208, 397, 210, 395, 209, 355, 219, 353, 213, 343, 211, 343, 210, 333, 213, 331, 216, 330, 216, 296, 196, 297, 183, 297, 176, 297, 176, 296, 175, 286, 165, 285, 155, 290, 146, 296, 129, 303, 124, 305]
		}, 
	"21" : { 		"CenterLocation": {x : 213.8759, y : 433.6704},
		"Coords": [204, 490, 225, 471, 239, 466, 241, 466, 236, 442, 235, 439, 238, 424, 241, 417, 240, 410, 231, 401, 231, 401, 233, 393, 225, 387, 216, 395, 209, 397, 200, 398, 186, 406, 182, 408, 183, 420, 188, 434, 193, 439, 195, 453, 198, 462, 203, 478, 206, 489, 236, 468, 239, 466]
		}, 
	"22" : { 		"CenterLocation": {x : 242.4586, y : 356.7398},
		"Coords": [247, 414, 262, 409, 276, 407, 278, 400, 272, 382, 270, 370, 268, 359, 268, 349, 274, 334, 274, 331, 264, 321, 255, 317, 250, 313, 246, 303, 240, 294, 231, 290, 228, 290, 222, 295, 221, 304, 218, 322, 215, 334, 213, 336, 216, 344, 219, 348, 214, 354, 209, 357, 211, 395, 219, 392, 221, 386, 224, 387, 229, 391, 233, 400, 236, 407, 240, 413, 244, 415, 250, 413]
		}, 
	"23" : { 		"CenterLocation": {x : 299.5411, y : 562.6863},
		"Coords": [337, 573, 328, 563, 323, 555, 316, 551, 316, 541, 309, 542, 297, 548, 294, 549, 273, 546, 262, 555, 265, 562, 269, 569, 275, 574, 288, 575, 307, 580, 324, 580, 329, 580, 338, 576]
		}, 
	"24" : { 		"CenterLocation": {x : 370.2748, y : 500.4833},
		"Coords": [403, 575, 409, 560, 409, 551, 410, 536, 407, 528, 406, 527, 415, 520, 415, 515, 419, 510, 423, 507, 427, 506, 429, 500, 429, 495, 433, 481, 432, 479, 428, 475, 412, 465, 407, 465, 403, 460, 397, 454, 389, 451, 384, 442, 376, 438, 374, 436, 341, 442, 339, 450, 336, 451, 330, 451, 323, 450, 317, 449, 314, 452, 312, 459, 309, 466, 309, 472, 314, 489, 316, 502, 319, 511, 327, 522, 335, 531, 342, 538, 348, 546, 360, 561, 361, 563, 371, 568, 379, 571, 386, 576, 393, 577, 405, 575]
		}, 
	"25" : { 		"CenterLocation": {x : 441.2013, y : 529.653},
		"Coords": [410, 557, 418, 558, 432, 563, 442, 563, 458, 553, 472, 547, 468, 503, 461, 502, 463, 483, 458, 483, 454, 493, 453, 496, 441, 500, 433, 503, 429, 504, 423, 510, 417, 514, 413, 518, 409, 522, 409, 531, 409, 538, 410, 548, 411, 556, 411, 559]
		}, 
	"26" : { 		"CenterLocation": {x : 506.9661, y : 482.9153},
		"Coords": [472, 542, 479, 539, 485, 532, 493, 522, 500, 518, 506, 514, 517, 510, 522, 509, 530, 506, 536, 501, 539, 494, 541, 482, 544, 469, 544, 464, 545, 454, 543, 449, 540, 444, 540, 428, 540, 424, 540, 419, 537, 417, 527, 420, 523, 424, 519, 427, 523, 435, 524, 438, 506, 459, 500, 463, 495, 467, 487, 472, 486, 474, 478, 474, 468, 479, 464, 484, 463, 501, 469, 504, 471, 545, 481, 537]
		}, 
	"27" : { 		"CenterLocation": {x : 570.2365, y : 335.2737},
		"Coords": [554, 349, 568, 358, 577, 363, 590, 353, 593, 345, 594, 335, 586, 331, 581, 325, 575, 315, 567, 311, 559, 309, 551, 308, 548, 308, 550, 319, 557, 351]
		}, 
	"28" : { 		"CenterLocation": {x : 494.8095, y : 325.5721},
		"Coords": [516, 366, 518, 349, 521, 342, 519, 327, 512, 316, 507, 313, 499, 306, 493, 301, 486, 297, 475, 294, 468, 292, 462, 292, 464, 308, 470, 309, 474, 318, 477, 323, 481, 330, 485, 340, 488, 348, 493, 351, 506, 358, 514, 363]
		}, 
	"29" : { 		"CenterLocation": {x : 482.3006, y : 434.4331},
		"Coords": [496, 368, 502, 369, 510, 378, 517, 388, 527, 402, 538, 412, 541, 417, 530, 421, 526, 423, 521, 431, 522, 437, 516, 447, 510, 456, 506, 460, 494, 471, 485, 475, 475, 477, 463, 481, 461, 482, 456, 488, 454, 493, 444, 498, 437, 502, 428, 507, 430, 484, 432, 471, 442, 460, 442, 449, 448, 445, 451, 445, 453, 445, 459, 427, 454, 419, 454, 408, 457, 406, 457, 400, 469, 400, 477, 392, 484, 383, 488, 377, 491, 374, 493, 368, 495, 367]
		}, 
	"30" : { 		"CenterLocation": {x : 417.4532, y : 428.3908},
		"Coords": [432, 474, 443, 461, 443, 448, 446, 444, 452, 442, 459, 429, 459, 426, 457, 419, 453, 418, 453, 410, 456, 407, 456, 402, 440, 402, 438, 402, 433, 402, 422, 391, 418, 389, 411, 384, 401, 391, 392, 397, 390, 397, 389, 402, 385, 409, 382, 414, 376, 427, 376, 430, 378, 439, 385, 443, 388, 448, 391, 454, 396, 457, 406, 464, 408, 466, 421, 469, 425, 470, 429, 471, 433, 471, 442, 459]
		}, 
	"31" : { 		"CenterLocation": {x : 336.9899, y : 417.4897},
		"Coords": [389, 396, 385, 407, 378, 420, 375, 428, 373, 435, 367, 436, 361, 440, 350, 441, 339, 445, 337, 446, 337, 449, 329, 449, 324, 450, 311, 455, 311, 456, 307, 443, 302, 439, 292, 431, 291, 430, 286, 421, 286, 415, 287, 412, 289, 411, 294, 408, 298, 408, 302, 408, 305, 407, 308, 407, 310, 405, 314, 400, 319, 392, 320, 388, 325, 387, 327, 387, 331, 387, 334, 387, 336, 387, 344, 387, 348, 388, 356, 388, 361, 388, 363, 388, 366, 389, 369, 390, 371, 392, 375, 393, 383, 396, 386, 397, 387, 397]
		}, 
	"32" : { 		"CenterLocation": {x : 327.7856, y : 376.0341},
		"Coords": [388, 395, 411, 384, 397, 378, 391, 379, 388, 380, 380, 380, 376, 373, 373, 370, 371, 366, 369, 362, 367, 358, 342, 351, 335, 349, 330, 349, 325, 351, 322, 351, 317, 352, 315, 352, 309, 351, 306, 351, 299, 354, 296, 356, 296, 357, 292, 358, 285, 360, 282, 358, 279, 356, 275, 361, 275, 365, 275, 369, 276, 375, 279, 382, 281, 389, 283, 397, 283, 403, 284, 406, 287, 407, 289, 408, 295, 409, 300, 409, 305, 408, 309, 405, 312, 402, 315, 394, 318, 390, 319, 390, 326, 388, 327, 387, 329, 385, 333, 384, 343, 387, 348, 387, 354, 387, 360, 390, 372, 391, 380, 393, 385, 395, 390, 395]
		}, 
	"33" : { 		"CenterLocation": {x : 366.5724, y : 297.5927},
		"Coords": [367, 355, 373, 338, 377, 337, 379, 325, 381, 318, 377, 317, 380, 314, 382, 313, 385, 311, 386, 303, 391, 297, 439, 290, 449, 279, 436, 268, 433, 243, 428, 237, 428, 233, 393, 240, 391, 245, 370, 251, 334, 277, 334, 286, 334, 297, 329, 303, 326, 313, 312, 323, 288, 327, 277, 333, 279, 356, 284, 360, 297, 355, 310, 348, 328, 350, 346, 351, 364, 354, 367, 355]
		}, 
	"34" : { 		"CenterLocation": {x : 398.2146, y : 216.1087},
		"Coords": [481, 189, 458, 184, 448, 183, 441, 181, 425, 179, 421, 179, 414, 179, 409, 179, 396, 187, 381, 197, 374, 202, 365, 207, 358, 211, 354, 214, 347, 219, 344, 222, 339, 231, 336, 235, 327, 242, 324, 245, 322, 256, 325, 258, 334, 259, 348, 256, 357, 254, 370, 250, 378, 247, 386, 243, 398, 238, 405, 236, 415, 235, 430, 234, 435, 233, 441, 220, 448, 212, 459, 201, 474, 198, 482, 195, 484, 190]
		}, 
	"35" : { 		"CenterLocation": {x : 667.4377, y : 485.1734},
		"Coords": [644, 516, 651, 516, 681, 516, 694, 515, 697, 515, 702, 512, 702, 508, 702, 504, 697, 504, 695, 500, 699, 497, 700, 496, 700, 441, 677, 443, 671, 456, 643, 471, 635, 474, 618, 487, 622, 501, 635, 507, 641, 514, 641, 519, 650, 519, 654, 516]
		}, 
	"36" : { 		"CenterLocation": {x : 729.7648, y : 489.5269},
		"Coords": [709, 562, 739, 533, 757, 506, 765, 485, 765, 471, 765, 442, 701, 442, 703, 497, 698, 500, 705, 507, 701, 514, 701, 518, 708, 560]
		}, 
	"37" : { 		"CenterLocation": {x : 649.9918, y : 445.0782},
		"Coords": [620, 485, 640, 471, 651, 467, 669, 456, 671, 451, 675, 442, 684, 442, 685, 411, 673, 417, 660, 419, 648, 419, 643, 422, 637, 431, 628, 438, 624, 441, 622, 448, 618, 456, 618, 463, 619, 475, 620, 485]
		}, 
	"38" : { 		"CenterLocation": {x : 727.1625, y : 414.2943},
		"Coords": [686, 441, 767, 441, 753, 403, 743, 370, 729, 360, 729, 371, 727, 380, 724, 386, 716, 397, 701, 409, 686, 413, 686, 442]
		}, 
	"39" : { 		"CenterLocation": {x : 744.3717, y : 159.6139},
		"Coords": [753, 227, 770, 204, 767, 183, 767, 159, 772, 152, 775, 122, 743, 118, 700, 121, 707, 144, 722, 158, 731, 170, 731, 188, 729, 192, 737, 202, 746, 215, 750, 228]
		}, 
	"40" : { 		"CenterLocation": {x : 675.4156, y : 318.8425},
		"Coords": [720, 295, 706, 310, 716, 357, 699, 369, 671, 373, 652, 363, 647, 357, 639, 340, 637, 330, 637, 317, 637, 313, 643, 279, 648, 263, 656, 263, 662, 261, 662, 267, 668, 271, 673, 272, 677, 267, 681, 272, 692, 269, 696, 270, 702, 274, 708, 284, 711, 291, 716, 295, 719, 296]
		}, 
	"41" : { 		"CenterLocation": {x : 322.7899, y : 52.91051},
		"Coords": [358, 69, 365, 82, 357, 86, 350, 83, 317, 81, 306, 87, 292, 83, 285, 75, 288, 70, 295, 70, 295, 55, 288, 50, 281, 48, 277, 45, 271, 41, 273, 34, 290, 30, 299, 26, 309, 23, 328, 24, 337, 25, 353, 28, 364, 22, 370, 21, 370, 27, 361, 35, 355, 42, 357, 48, 360, 53, 356, 61, 356, 69, 363, 84]
		}
    } //End of territories

}; //end of click data