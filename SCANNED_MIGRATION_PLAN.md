# Current data structure

See server/src/db/entries.ts for some relevant functions that work with the existing data if more details are needed.

All data paths should be understood as being inside of `$DIARY_DIR`.

Current data:

- Scanned image files with paths like `scanned/????/??/??/scanned-??.*` (pngs and jpgs)
- Markdown files with paths like `entries/????/??/??/diary.md`
- Some dates have scanned entries only, some have markdown only and some have both
- Meta data for every scanned image file with paths like `scanned-meta/????/??/??/scanned-??.*.json`
    - The only relevant data in the meta json is "headings" which is a list of strings

# Migration plan

- create a migration script in server/scripts
- Scanned files should be moved to live alongside the markdown files
    - For example `scanned/????/??/??/scanned-??.*` should be moved to `entries/????/??/??/scanned-??.*` creating dirs as necessary
    - For each scanned file moved like this, it should look up the headings from the linked meta json file and insert them into the existing markdown entry for that day (as second level markdown headings), it should then have a markdown image linking to the relative path of the scanned file
    - scanned files can have zero or more headings
        - if zero and it's the first scanned file for the day insert a new heading of "X scanned pages" where X is the number of scanned files for the day
        - if zero and it's not the first scanned file for the day just put the image
        - if one put the heading above the image
        - if more than one put multiple headings above the image
    - if no markdown file existed a new one should be made (creating dirs as necessary), if one already existed new content should be appended to the end of it (with empty line separating)
- afterwards, remove all empty dirs in scanned and delete all scanned-meta files/dirs
- if anything doesn't match the exact formats described (eg any files at all encountered in the dirs that don't match these patterns) then a warning should be printed and the unknown files should not be deleted

# Server changes

- the new markdown images should be relative links
    - eg `![](scanned-01.png)`
- this format won't work with the way the existing server/pwa serves images so changes need to be made
- modify the pwa to change requested image paths to prepend `/files/????/??/??/` to them based on the entry's date
- modify the server to delete both the existing `/images` and `/scanned` routes
- add a new server route `/files` that proxies to the entries dir

# Audio file migration

- Audio files exist in the format `audio/????/??/??/audio-??-??.*`
- Audio files should also be migrated in a similar way to scanned entries above with the following differences:
    - still use the markdown image format (eg `![](audio-09-12.mp4)`)
    - there is no meta info for audio files
    - when adding the markdown section, it should generate one heading per audio file with the format `## HH:MM Audio entry (X minutes)`
        - the `HH:MM` comes from the filename
        - "X minutes" should be calculated by looking at the file on disc (using ffmpeg commands)
        - if X is less than 5 then it should print something like "3 minutes 42 seconds"
        - otherwise round to the nearest minute
        - do not consider hours (eg 1h30m is just 90 minutes)
- scanned entries have no time, audio files have a time and existing markdown headers may or may not have a time at the start
    - scanned entries should always be placed at the end of a file
    - audio entries should be merged into the existing markdown file by looking at any headings with times that already exist
    - if an existing markdown heading has no time then it should be treated as having the same time as the heading above it (or 00:00 if it's the first)
- the server route for audio can be deleted (use the new files one instead)
- update the pwa to render audio files based on filename (supporting the most common file formats that are supported by browsers)
