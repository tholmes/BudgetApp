; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define MyAppName "BudgetApp"
#define MyAppVersion "18.09.13"
#define MyAppPublisher "HolmeswareApps"
#define MyAppURL "https://github.com/tholmes/BudgetApp"
#define MyAppExeName "BudgetApp.bat"

[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{A6E189BA-F3A2-4F9F-BF66-A02CA67F7877}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DisableDirPage=yes
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
OutputDir=C:\Users\Tim\Documents\dev\BudgetApp\Installer
OutputBaseFilename=BudgetApp-setup
Compression=lzma
SolidCompression=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "C:\Users\Tim\Documents\dev\BudgetApp\BudgetApp.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\Tim\Documents\dev\BudgetApp\database-create.js"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\Tim\Documents\dev\BudgetApp\database-functions.js"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\Tim\Documents\dev\BudgetApp\node.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\Tim\Documents\dev\BudgetApp\server.js"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\Tim\Documents\dev\BudgetApp\node_modules\*"; DestDir: "{app}\node_modules"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "C:\Users\Tim\Documents\dev\BudgetApp\public\*"; DestDir: "{app}\public"; Flags: ignoreversion recursesubdirs createallsubdirs
; NOTE: Don't use "Flags: ignoreversion" on any shared system files

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: shellexec postinstall skipifsilent

