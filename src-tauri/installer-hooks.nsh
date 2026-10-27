; The Tauri installer owns this ProgID. Do not write UserChoice or force a default app.
!macro NSIS_HOOK_POSTINSTALL
  WriteRegStr SHELL_CONTEXT "Software\Classes\APIO GRAPH project\DefaultIcon" "" '$\"$INSTDIR\aph-document.ico$\",0'
  !insertmacro UPDATEFILEASSOC
!macroend
