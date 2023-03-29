import sys
from numpy import random
import pygame
from pygame.locals import KEYDOWN, K_q
import numpy as np
import scipy

# CONSTANTS:
SCREENSIZE = WIDTH, HEIGHT = 1050, 1000
BLACK = (0, 0, 0)
GREY = (255, 255, 255)
RED = (255, 0, 0)
GLIDERMODE_COLOR = (235, 180, 0)
GUNMODE_COLOR = (50, 0, 200)
NORMAL_COLOR = ( 50, 50, 50)
draw = False

# OUR GRID MAP:
gridsize = 400
cellMAP = np.zeros((gridsize,gridsize))

_VARS = {'surf': False, 'gridWH': 1000,
         'gridOrigin': (0, 0), 'gridCells': cellMAP.shape[0], 'lineWidth': 2}

def main():
    pygame.init()
    _VARS['surf'] = pygame.display.set_mode(SCREENSIZE)
    while True:
        checkEvents()
        if draw:
            mouseDraw()
        else:
            _VARS['surf'].fill(GREY)
            gameoflife()

        placeCells()
        drawNav()

        pygame.display.update()

def gameoflife():
    global cellMAP

    #WTFFFFFFFFFF
    neighbors = scipy.signal.convolve2d(cellMAP, np.ones((3,3)), mode='same', boundary='wrap') - cellMAP
    cellMAP = np.logical_or(np.logical_and(cellMAP==1, neighbors==2), neighbors==3).astype(int)

    #y = 0
    #newcellMAP = np.zeros((gridsize,gridsize))

    #for row in range(cellMAP.shape[0]):
    #    x = 0
    #    for column in range(cellMAP.shape[1]):
    #        newcellMAP[x][y] = checkneighbors(x,y)
    #        x = x + 1
    #    y = y + 1

    #cellMAP = newcellMAP

def checkneighbors(x, y):
    numalive = countalive(x,y)
    if numalive == 3 and cellMAP[x][y] == 0:
        return 1
    if numalive < 2 and cellMAP[x][y] == 1:
        return 0
    if (numalive == 2 or numalive == 3) and cellMAP[x][y] == 1:
        return 1
    if numalive > 3  and cellMAP[x][y] == 1:
        return 0
    return cellMAP[x][y]

def countalive(x, y):
    count = 0
    for a in range(-1, 2):
        for b in range(-1, 2):
            if a == 0 and b == 0:
                continue
            neighbor_x = (x + a) % gridsize
            neighbor_y = (y + b) % gridsize
            if cellMAP[neighbor_x][neighbor_y] == 1:
                count += 1
    return count


# NEW METHOD FOR ADDING CELLS :
def placeCells():
    # GET CELL DIMENSIONS...
    cellBorder = 0
    celldimX = celldimY = (_VARS['gridWH']/_VARS['gridCells']) - (cellBorder*2)
    # DOUBLE LOOP
    for row in range(cellMAP.shape[0]):
        for column in range(cellMAP.shape[1]):
            # Is the grid cell tiled ?
            if(cellMAP[column][row] == 1):
                drawSquareCell(
                    _VARS['gridOrigin'][0] + (celldimY*row)
                    + cellBorder + (2*row*cellBorder) + _VARS['lineWidth']/2,
                    _VARS['gridOrigin'][1] + (celldimX*column)
                    + cellBorder + (2*column*cellBorder) + _VARS['lineWidth']/2,
                    celldimX, celldimY)

# Draw filled rectangle at coordinates
def drawSquareCell(x, y, dimX, dimY):
    pygame.draw.rect(_VARS['surf'], BLACK, (x, y, dimX, dimY))


def drawSquareGrid(origin, gridWH, cells):

    CONTAINER_WIDTH_HEIGHT = gridWH
    cont_x, cont_y = origin

    # DRAW Grid Border:
    # TOP lEFT TO RIGHT
    pygame.draw.line(
      _VARS['surf'], BLACK,
      (cont_x, cont_y),
      (CONTAINER_WIDTH_HEIGHT + cont_x, cont_y), _VARS['lineWidth'])
    # # BOTTOM lEFT TO RIGHT
    pygame.draw.line(
      _VARS['surf'], BLACK,
      (cont_x, CONTAINER_WIDTH_HEIGHT + cont_y),
      (CONTAINER_WIDTH_HEIGHT + cont_x,
       CONTAINER_WIDTH_HEIGHT + cont_y), _VARS['lineWidth'])
    # # LEFT TOP TO BOTTOM
    pygame.draw.line(
      _VARS['surf'], BLACK,
      (cont_x, cont_y),
      (cont_x, cont_y + CONTAINER_WIDTH_HEIGHT), _VARS['lineWidth'])
    # # RIGHT TOP TO BOTTOM
    pygame.draw.line(
      _VARS['surf'], BLACK,
      (CONTAINER_WIDTH_HEIGHT + cont_x, cont_y),
      (CONTAINER_WIDTH_HEIGHT + cont_x,
       CONTAINER_WIDTH_HEIGHT + cont_y), _VARS['lineWidth'])

    # Get cell size, just one since its a square grid.
    cellSize = CONTAINER_WIDTH_HEIGHT/cells

    # VERTICAL DIVISIONS: (0,1,2) for grid(3) for example
    for x in range(cells):
        pygame.draw.line(
           _VARS['surf'], BLACK,
           (cont_x + (cellSize * x), cont_y),
           (cont_x + (cellSize * x), CONTAINER_WIDTH_HEIGHT + cont_y), 2)
    # # HORIZONTAl DIVISIONS
        pygame.draw.line(
          _VARS['surf'], BLACK,
          (cont_x, cont_y + (cellSize*x)),
          (cont_x + CONTAINER_WIDTH_HEIGHT, cont_y + (cellSize*x)), 2)

def drawNav():
    drawGNormalButton(1000, 10, 50, 50)
    drawGliderButton(1000, 70, 50, 50)
    drawGunButton(1000, 130, 50, 50)
    drawClearButton(1000, 940, 50, 50)

gliderMode = False
gunMode = False
normalMode = True

def drawGliderButton(x, y, dimX, dimY):
    global normalMode, gunMode, gliderMode
    pos = pygame.mouse.get_pos()

    if pos[0] > x and pos[0] < x + dimX and pos[1] > y and pos[1] < y + dimY:
        for event in pygame.event.get():
            if event.type == pygame.MOUSEBUTTONDOWN:
                gliderMode = True
                gunMode = False
                normalMode = False
    
    pygame.draw.rect(_VARS['surf'], GLIDERMODE_COLOR, (x, y, dimX, dimY))

def drawGNormalButton(x, y, dimX, dimY):
    global normalMode, gunMode, gliderMode
    pos = pygame.mouse.get_pos()

    if pos[0] > x and pos[0] < x + dimX and pos[1] > y and pos[1] < y + dimY:
        for event in pygame.event.get():
            if event.type == pygame.MOUSEBUTTONDOWN:
                gunMode = False
                gliderMode = False
                normalMode = True
    
    pygame.draw.rect(_VARS['surf'], NORMAL_COLOR, (x, y, dimX, dimY))

def drawGunButton(x, y, dimX, dimY):
    global normalMode, gunMode, gliderMode
    pos = pygame.mouse.get_pos()

    if pos[0] > x and pos[0] < x + dimX and pos[1] > y and pos[1] < y + dimY:
        for event in pygame.event.get():
            if event.type == pygame.MOUSEBUTTONDOWN:
                gunMode = True
                gliderMode = False
                normalMode = False
    
    pygame.draw.rect(_VARS['surf'], GUNMODE_COLOR, (x, y, dimX, dimY))

def drawClearButton(x, y, dimX, dimY):
    global gliderMode, cellMAP
    pos = pygame.mouse.get_pos()

    if pos[0] > x and pos[0] < x + dimX and pos[1] > y and pos[1] < y + dimY:
        for event in pygame.event.get():
            if event.type == pygame.MOUSEBUTTONDOWN:
                cellMAP = np.zeros((gridsize,gridsize))
    pygame.draw.rect(_VARS['surf'], RED, (x, y, dimX, dimY))


def checkEvents():
    global draw
    for event in pygame.event.get():
        if event.type == pygame.MOUSEBUTTONDOWN:
            draw = True
        if event.type == pygame.MOUSEBUTTONUP:
            draw = False
        if event.type == pygame.QUIT:
            sys.exit()
        elif event.type == KEYDOWN and event.key == K_q:
            pygame.quit()
            sys.exit()

def mouseDraw():
    global cellMAP
    pos = pygame.mouse.get_pos()
    if pos[0] >= HEIGHT or pos[1] >= WIDTH:
        return
    
    cellw = _VARS['gridWH'] / gridsize
    if gliderMode:
        draw_pattern('gun', int(pos[1] / cellw),int(pos[0] / cellw))
    elif gunMode:
        draw_pattern('circle', int(pos[1] / cellw),int(pos[0] / cellw))
    else:
        cellMAP[int(pos[1] / cellw)][int(pos[0] / cellw)] = 1

patterns = {
    'glider': [(0,0), (1,1), (1,2), (2,0), (2,1)],
    'gun': [(0,2),(1,2),(0,3),(1,3),(0,12),(1,12),(-1,12),(2,13),(-2,13),(-3,14),(3,14),(3,15),(-3,15),(0,16),(2,17),(-2,17),(1,18),(0,18),(-1,18),(0,19),(1,22),(2,22),(3,22),(1,23),(2,23),(3,23),(0,24),(4,24),(0,26),(-1,26),(4,26),(5,26),(2,36),(3,36),(2,37),(3,37)],
    'psychedelic': [(0,0), (0,2), (1,-1), (1,3), (2,-1), (2,3), (3,0), (3,2), (4,1), (10,10), (10,12), (11,9), (11,13), (12,9), (12,13), (13,10), (13,12), (14,11)],
    'breeder' : [(1,3), (1,4), (2,3), (2,4), (11,3), (11,4), (11,5), (12,2), (12,6), (13,1), (13,7), (14,1), (14,7), (15,4), (16,2), (16,6), (17,3), (17,4), (17,5), (18,4), (21,1), (21,2), (21,3), (22,1), (22,2), (22,3), (23,0), (23,4), (25,-1), (25,0), (25,4), (25,5), (35,2), (35,3), (36,2), (36,3)],
    'orbital_dance' : [(0,0), (0,2), (0,3), (0,5), (0,6), (1,1), (1,2), (1,3), (1,4), (1,5), (2,0), (2,2), (2,3), (2,5), (2,6), (3,1), (3,2), (3,3), (3,4), (3,5), (4,0), (4,2), (4,3), (4,5), (4,6), (6,12), (6,13), (6,14), (6,15), (6,16), (6,17), (6,18), (6,19), (6,20), (6,21), (7,11), (7,22), (8,10), (8,23), (9,10), (9,23), (10,10), (10,23), (11,10), (11,23), (12,10), (12,23), (13,10), (13,23), (14,10), (14,23), (15,10), (15,23), (16,10), (16,23), (17,10), (17,23), (18,10), (18,23), (19,11), (19,22), (20,12), (20,13), (20,14), (20,15), (20,16), (20,17), (20,18), (20,19), (20,20), (20,21)],
    'circle': [(0, 1), (0, 2), (0, 3), (0, 4), (0, 5), (0, 6), (0, 7), (0, 8), (0, 9), (0, 10), (1, 0), (1, 11), (2, 0), (2, 11), (3, 0), (3, 11), (4, 0), (4, 11), (5, 0), (5, 11), (6, 0), (6, 11), (7, 0), (7, 11), (8, 0), (8, 11), (9, 0), (9, 11), (10, 1), (10, 2), (10, 3), (10, 4), (10, 5), (10, 6), (10, 7), (10, 8), (10, 9), (10, 10),],
    }

def draw_pattern(pattern_name, x, y):
    global cellMAP
    if pattern_name not in patterns:
        return
    pattern = patterns[pattern_name]
    for p in pattern:
        cellMAP[x+p[0]][y+p[1]] = 1

if __name__ == '__main__':
    
    main()

