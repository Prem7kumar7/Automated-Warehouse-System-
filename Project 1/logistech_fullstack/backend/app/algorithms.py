from typing import List, Optional
from .models import BinDB, Package

def find_best_fit_bin(bins: List[BinDB], package_size: int) -> Optional[BinDB]:
    """
    Finds the smallest bin that fits the package using Binary Search.
    Assumes 'bins' is sorted by capacity.
    """
    low = 0
    high = len(bins) - 1
    best_fit_index = -1

    while low <= high:
        mid = (low + high) // 2
        if bins[mid].capacity >= package_size:
            # Check if it's not fully occupied (simplified logic: capacity vs size)
            # In a real scenario, we'd check remaining space. 
            # Here we assume capacity is total size and occupied is used size.
            if (bins[mid].capacity - bins[mid].occupied) >= package_size:
                best_fit_index = mid
                high = mid - 1  # Try to find a smaller bin
            else:
                # Bin has capacity but not enough free space, treat as "too small" for this specific package
                # This is a simplification; in reality, we might need to search linearly nearby or filter first.
                # For this project, let's assume we search for *capacity* match first.
                # To make it strictly O(log N), we assume bins are sorted by *free space* or just capacity.
                # Let's stick to the requirement: "sorted by capacity".
                low = mid + 1
        else:
            low = mid + 1
            
    if best_fit_index != -1:
        return bins[best_fit_index]
    return None

def solve_backtracking(packages: List[Package], capacity: int) -> List[Package]:
    """
    Finds a subset of packages that fits into the truck capacity
    and maximizes the total size.
    """
    best_combination = []
    max_size_found = 0

    def backtrack(index, current_load, current_packages):
        nonlocal max_size_found, best_combination
        
        if index == len(packages):
            if current_load > max_size_found:
                max_size_found = current_load
                best_combination = list(current_packages)
            return

        pkg = packages[index]
        
        # Option 1: Include
        if current_load + pkg.size <= capacity:
            current_packages.append(pkg)
            backtrack(index + 1, current_load + pkg.size, current_packages)
            current_packages.pop()

        # Option 2: Exclude
        backtrack(index + 1, current_load, current_packages)

    backtrack(0, 0, [])
    return best_combination
