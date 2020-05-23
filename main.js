const electron = require('electron');
const url= require('url');
const path = require('path');
const {app, BrowserWindow, Menu,ipcMain} = electron;

let mainwindow;
let addwindow;
process.env.NODE_ENV='production';

app.on('ready', ()=>{
    //Create new window
    mainwindow=new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    //Load html file
    mainwindow.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file',
        slashes:true
    }));
    mainwindow.on('closed',()=>{
        app.quit();
    });
    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert the menu
    Menu.setApplicationMenu(mainMenu);
});
//quit app when mainwindow close


//handle add window

var createAddWindow=()=>{
    addwindow=new BrowserWindow({
        width:300,
        height:200,
        title:'Add Shopping Item',
        webPreferences: {
            nodeIntegration: true
        }
    });
    //Load html file
    addwindow.loadURL(url.format({
        pathname:path.join(__dirname,'additem.html'),
        protocol:'file',
        slashes:true
    }));
    addwindow.on('closed',()=>{
        addwindow=null;
    })

}

 //catch item
 ipcMain.on('item:add',function(e,item){
     mainwindow.webContents.send('items',item); 
     addwindow.close()
 })
//create menutemplate

const mainMenuTemplate = [ 
    {
        label:'File',
        submenu:[
            {
                label:'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label:'Clear Items',
                click(){
                    mainwindow.webContents.send('clearitems');
                }
            },
            {
                label:'Quit',
                accelerator: process.platform=='darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]

    }
];

if(process.platform=='darwin'){
    mainMenuTemplate.unshift({
        label:''
    });
}


//Add developer tools if not in production

if(process.env.NODE_ENV!=='production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[{
            label:'Toggle Devtools',
            accelerator: process.platform=='darwin' ? 'Command+I' : 'Ctrl+I',
            click(item,focusedWindows){
                focusedWindows.toggleDevTools()
            }
        },
        { 
            role:'reload'
        }
    ]
    })
}