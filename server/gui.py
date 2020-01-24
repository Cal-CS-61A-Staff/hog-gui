"""Web server for the hog GUI."""
import io
from contextlib import redirect_stdout

from gui_files.common_server import route, start

import hog
import dice

PORT = 31415
DEFAULT_SERVER = "https://hog.cs61a.org"
GUI_FOLDER = "gui_files/"
PATHS = {}


class HogLoggingException(Exception):
    pass


@route
def take_turn(prev_rolls, move_history, goal):
    fair_dice = dice.make_fair_dice(6)
    dice_results = []

    def logged_dice():
        if len(dice_results) < len(prev_rolls):
            out = prev_rolls[len(dice_results)]
        else:
            out = fair_dice()
        dice_results.append(out)
        return out

    final_scores = None
    final_message = None

    commentary = hog.both(
        hog.announce_highest(0),
        hog.both(hog.announce_highest(1), hog.announce_lead_changes()),
    )

    def log(*logged_scores):
        nonlocal final_scores, final_message, commentary
        final_scores = logged_scores
        f = io.StringIO()
        with redirect_stdout(f):
            commentary = commentary(*logged_scores)
        final_message = f.getvalue()
        return log

    move_cnt = 0

    def strategy(*args):
        nonlocal move_cnt
        if move_cnt == len(move_history):
            raise HogLoggingException()
        move = move_history[move_cnt]
        move_cnt += 1
        return move

    game_over = False

    try:
        hog.play(strategy, strategy, dice=logged_dice, say=log, goal=goal)
    except HogLoggingException:
        pass
    else:
        game_over = True

    return {
        "rolls": dice_results,
        "finalScores": final_scores,
        "message": final_message,
        "gameOver": game_over,
    }


@route
def strategy(name, scores):
    STRATEGIES = {
        "bacon_strategy": hog.bacon_strategy,
        "swap_strategy": hog.swap_strategy,
        "final_strategy": hog.final_strategy,
    }
    return STRATEGIES[name](*scores[::-1])


app = start(PORT, DEFAULT_SERVER, GUI_FOLDER)
