#!/bin/bash

WORKDIR="files"

MAX_MEMORY=$(cat /sys/fs/cgroup/memory.max)
MAX_MEMORY=$((MAX_MEMORY-20000000))
cd "$WORKDIR" && java -XX:MaxRAM=$MAX_MEMORY -XX:MaxRAMPercentage=$CONFIG_MAX_RAM_PERCENTAGE -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:+AlwaysPreTouch -jar app.jar nogui
