Function RecursiveRegKey() 
{
    param 
    (
        [Parameter(Mandatory=$true)]
        [String]$ComputerName,

        [Parameter(Mandatory=$true)]
        [String]$HiveName,

        [Parameter(Mandatory=$true)]
        [String]$KeytablePath
    )

    # Declare file which will store key table
    New-Item $KeytablePath -Force

    # Open and store the selected hive
    $Hive = [Microsoft.Win32.RegistryKey]::OpenRemoteBaseKey($HiveName, $ComputerName)

    Function WriteToTable($Content)
    {
        try {
            Add-Content $KeytablePath $Content
            Start-Sleep -Milliseconds 1
        }
        catch {
            Write-Output("Failed to write. File in use...")
        }
    }

    Function GetChildren($Key)
    {
        $ChildrenKeys = @()
        if($Key.SubKeyCount -gt 0)
        {
            foreach($SubKey in $Key.GetSubKeyNames())
            {
                $ChildrenKeys += ($Key.ToString()+"\"+$SubKey.ToString())
            }
        }

        if ($Key.ValueCount -gt 0) 
        {
            foreach($Value in $Key.GetValueNames())
            {
                $ChildrenKeys += ($Key.ToString()+"\"+$Value.ToString())
            } 
        }
        
        if ($ChildrenKeys.Length -gt 0)
        {
            $ChildrenKeyString = $ChildrenKeys -Join ";"
            return $ChildrenKeyString
        }
        else 
        {
            return ""
        }
    }

    Function Burrow() 
    {
        param 
        (
            [Parameter(Mandatory=$true)]
            [AllowNull()]
            [AllowEmptyString()]
            [Microsoft.Win32.RegistryKey]$Key
        )

        # Create line for current key
        $KeyName = $Key.ToString()
        $KeyName = $KeyName + "|" + (GetChildren($Key))

        WriteToTable($KeyName)
        #Write-Output("Writing ", $KeyName)

        # If the current key has subkeys, we recurse through them
        if($Key.SubKeyCount -gt 0)
        {
            ForEach($SubKey in $Key.GetSubKeyNames())
            {
                Burrow -Key $Key.OpenSubKey($SubKey);
            }
        }
        
        
    }
    Burrow -Key $Hive
}

RecursiveRegKey -ComputerName $(hostname) -HiveName "ClassesRoot" -KeytablePath "C:\Users\Administrator\Documents\Projects\Data Visuals\gen_keytable\keytables\hkcr_keytable.txt"
