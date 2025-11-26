from collections import deque
from typing import List, Optional
from .models import Package

class ConveyorBelt:
    def __init__(self):
        self.queue = deque()

    def add_package(self, package: Package):
        self.queue.append(package)

    def pop_package(self) -> Optional[Package]:
        if self.queue:
            return self.queue.popleft()
        return None

    def get_items(self) -> List[Package]:
        return list(self.queue)

    def size(self) -> int:
        return len(self.queue)

class LoadingDock:
    def __init__(self):
        self.stack: List[Package] = []

    def load_package(self, package: Package):
        self.stack.append(package)

    def rollback(self) -> Optional[Package]:
        if self.stack:
            return self.stack.pop()
        return None

    def get_items(self) -> List[Package]:
        return list(reversed(self.stack)) # Show top first
