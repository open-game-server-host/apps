#!/bin/bash

WORKDIR="files"

EULA_FILE="$WORKDIR/eula.txt"
echo "eula=true" > "$EULA_FILE"

SERVER_ICON_FILE="$WORKDIR/server-icon.png"
STARTUP_SERVER_ICON_FILE="startup_files/server-icon.png"
if [ ! -f "$SERVER_ICON_FILE" ]; then
	cat "$STARTUP_SERVER_ICON_FILE" > "$SERVER_ICON_FILE"
fi

MAX_MEMORY=$(cat /sys/fs/cgroup/memory.max)
MAX_MEMORY=$((MAX_MEMORY-20000000))
cd "$WORKDIR" && java -XX:MaxRAM=$MAX_MEMORY -XX:MaxRAMPercentage=$CONFIG_MAX_RAM_PERCENTAGE -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar app.jar
