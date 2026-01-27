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
if [ ! -f "$WORKDIR/app.jar" ]; then
    cd "$WORKDIR" && java -XX:MaxRAM=$MAX_MEMORY -XX:MaxRAMPercentage=$CONFIG_MAX_RAM_PERCENTAGE @libraries/net/minecraftforge/forge/$CURRENT_BUILD_INFO/unix_args.txt "$@"
else
    cd "$WORKDIR" && java -XX:MaxRAM=$MAX_MEMORY -XX:MaxRAMPercentage=$CONFIG_MAX_RAM_PERCENTAGE -jar app.jar
fi
