import numpy as np
from scipy.signal import find_peaks

def support_resistence(min_ : np.ndarray, max_ : np.ndarray, distance=10, prominence=1):
    res_idx, _ = find_peaks(max_, distance=distance, prominence=prominence)
    sup_idx, _ = find_peaks(-min_, distance=distance, prominence=prominence)

    return min_[sup_idx], max_[res_idx], sup_idx, res_idx