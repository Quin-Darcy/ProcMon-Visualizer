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
        }
        catch {
            Write-Out("Failed to write. File in use...")
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
        WriteToTable($KeyName)

        # Get parent key and write parent key to table
        $PathParts = $Key.ToString().Split("\")
        $ShortendPathParts = $PathParts[0..($PathParts.Length-2)]
        $ParentKeyName = $ShortendPathParts -Join '\'
        WriteToTable("    $ParentKeyName")

        $ShortendPathParts = $PathParts[1..($PathParts.Length-2)]
        $ParentKeyName = $ShortendPathParts -Join "\"
        $ParentKey = $Hive.OpenSubKey($ParentKeyName)

        # Get sibling keys and write them to file
        $SiblingKeys = @()
        if($ParentKey.SubKeyCount -gt 0)
        {
            foreach($SubKey in $ParentKey.GetSubKeyNames())
            {
                $SiblingKeys += ($ParentKey.ToString()+"\"+$SubKey.ToString())
            }
            $SiblingKeyString = $SiblingKeys -Join ';'
            WriteToTable("    $SiblingKeyString")
        }
        else 
        {
            WriteToTable("    ")
        }

        # Get children subkeys/values and append to table
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
            WriteToTable("    $ChildrenKeyString")
        }
        else 
        {
            WriteToTable("    ")    
        }

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

RecursiveRegKey -ComputerName $(hostname) -HiveName "CurrentUser" -KeytablePath "C:\Users\Administrator\Documents\Projects\Powershell\get_reg_keys\keytable.txt"