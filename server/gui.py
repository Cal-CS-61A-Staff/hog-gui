"""Web server for the hog GUI."""

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
def take_turn(scores, num_rolls):
    fair_dice = dice.make_fair_dice(6)
    dice_results = []

    def logged_dice():
        out = fair_dice()
        dice_results.append(out)
        return out

    final_scores = None

    def log(*logged_scores):
        nonlocal final_scores
        final_scores = logged_scores
        raise HogLoggingException()

    strategy0 = lambda s1, s2: num_rolls
    strategy1 = None  # should never be called
    goal = 100

    try:
        hog.play(strategy0, strategy1, *scores, logged_dice, goal, log)
    except HogLoggingException:
        pass

    return {
        "rolls": dice_results,
        "finalScores": final_scores
    }


app = start(PORT, DEFAULT_SERVER, GUI_FOLDER)
