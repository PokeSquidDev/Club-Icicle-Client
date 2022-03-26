const {
    app,
    dialog,
    BrowserWindow,
    Menu,
    MenuItem,
    ipcMain,
    nativeTheme,
    shell
} = require('electron')

const DiscordRPC = require('discord-rpc');
let rpc

const path = require('path');


let pluginName
switch (process.platform) {
case 'win32':
    switch (process.arch) {
    case 'x32':
        pluginName = 'flash/pepflashplayer32_32_0_0_303.dll'
        break
    case 'x64':
        pluginName = 'flash/pepflashplayer64_32_0_0_303.dll'
        break
    }
    break
case 'darwin':
    pluginName = 'flash/PepperFlashPlayer.plugin'
    break
case 'linux':
    app.commandLine.appendSwitch('no-sandbox')
    pluginName = 'flash/libpepflashplayer.so'
    break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));

var win
var pro
app.on('ready', () => {
    createWindow();
})

//window creation function
function createWindow() {
    win = new BrowserWindow
    ({
    title: "Club Icicle",
    webPreferences: {
        plugins: true,
        nodeIntegration: false
    },
    width: 1385,
    height: 840
    });
    makeMenu();
    //activateRPC();
	
    toDashboard();
    Menu.setApplicationMenu(fsmenu);
	
    win.on('closed', () => {
    	win = null;
    });
}

//prompt
function createPrompt() {
    //Check if window is already open
    if (pro) { 
       pro.focus();
       return;
    }
	
    pro = new BrowserWindow
    ({
	    title: "Club Icicle",
	    webPreferences: {
		plugins: true,
		nodeIntegration: true
	    },
	    width: 409,
	    height: 153
    });
    makeMenu();
	
    pro.on('closed', () => {
    	pro = null;
    });
}

// start of menubar part

const aboutMessage = `Club Icicle v${app.getVersion()}
Created by Squid Ska with most code provided by Allinol for use with Coastal Freeze as well as Random for use with CPPSCreator. \nThis is a beta release, which is used as a way to test unstable features. Expect to encounter various bugs.`;

const experimentsError = `You're using a stable release!
Experiments are designed for users of unstable releases, as most content within this page is (in future at minimum) designed to interact with the client in an unstable manner.`;

function activateRPC() {
    const clientId = '';
    DiscordRPC.register(clientId);
    rpc = new DiscordRPC.Client({ transport: 'ipc' });
    const startTimestamp = new Date();
    rpc.on('ready', () => {
        rpc.setActivity({
            details: `Playing Club Icicle`,
            startTimestamp,
            largeImageKey: ''
        });
    });
    rpc.login({ clientId }).catch();
}

function makeMenu() { // credits to random
    fsmenu = new Menu();
    if (process.platform == 'darwin') {
        fsmenu.append(new MenuItem({
            label: "Club Icicle Client",
            submenu: [{
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox({
                            type: "info",
                            buttons: ["Ok"],
                            title: "About Club Icicle",
                            message: aboutMessage
                        });
                    }
            },
                {
                label: 'Return to Dashboard',
                click: () => {
                toDashboard();
                }
                },
                
                {
                    label: 'Fullscreen (Toggle)',
                    accelerator: 'CmdOrCtrl+F',
                    click: () => {
                        win.setFullScreen(!win.isFullScreen());
                        win.webContents.send('fullscreen', win.isFullScreen());
                    }
                },

                {
                    label: 'Mute Audio (Toggle)',
                    click: () => {
                        win.webContents.audioMuted = !win.webContents.audioMuted;
                        win.webContents.send('muted', win.webContents.audioMuted);
                    }
                },

                {
                    label: 'Clear Cache',
                    click: () => {
                        clearCache();
                    }
                }
            ]
        }));
    } else {
        fsmenu.append(new MenuItem({
            label: 'About',
            click: () => {
                dialog.showMessageBox({
                    type: "info",
                    buttons: ["Ok"],
                    title: "About Club Icicle",
                    message: aboutMessage
                });
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Return to Dashboard',
            click: () => {
                toDashboard();
            }
        }));
        
        fsmenu.append(new MenuItem({
            label: 'Fullscreen (Toggle)',
            accelerator: 'CmdOrCtrl+F',
            click: () => {
                win.setFullScreen(!win.isFullScreen());
                win.webContents.send('fullscreen', win.isFullScreen());
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Mute Audio (Toggle)',
            click: () => {
                win.webContents.audioMuted = !win.webContents.audioMuted;
                win.webContents.send('muted', win.webContents.audioMuted);
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Clear Cache',
            click: () => {
                clearCache();
            }
        }));
    }
}

function toDashboard() {
    clearCache();
    win.loadURL('https://clubicicle.000webhostapp.com/client/dashboard.html');
}

function clearCache() {
    windows = BrowserWindow.getAllWindows()[0];
    const ses = win.webContents.session;
    ses.clearCache(() => {});
}

// end of menubar

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
  if (win === null) {
	  createWindow();
  }
});
