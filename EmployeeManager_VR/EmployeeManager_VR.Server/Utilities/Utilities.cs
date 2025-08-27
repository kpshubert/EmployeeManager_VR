using Microsoft.Identity.Client;

namespace EmployeeManager_VR.Server.Utilities;
public static class Utilities
{
    public static void CopySharedPropertyValues<FromType, ToType>(FromType fromObject, ToType toObject)
    {
        foreach (var fromObjectProperty in typeof(FromType).GetProperties())
        {
            var fromObjectPropertyValue = fromObjectProperty.GetValue(fromObject);
            var toObjectHasProperty = typeof(ToType).GetProperty(fromObjectProperty.Name) != null;

            if (toObject != null && fromObject != null && toObjectHasProperty)
            {
                var toObjectType = toObject.GetType();
                var fromObjectType = fromObject.GetType();

                var toObjectProperty = typeof(ToType).GetProperty(fromObjectProperty.Name);

                if (toObjectProperty != null && toObjectProperty.GetType() == fromObjectProperty.GetType())
                {
                    try
                    {
                        toObjectProperty.SetValue(toObject, fromObjectPropertyValue, null);
                    }
                    catch
                    {
                    }
                }
            }
        }
    }
    public static string GetAppSetting(string AppsetingIn)
    {
        var returnValue = string.Empty;

        var appSettingsFileName = "appsettings.json";

        if (!string.IsNullOrWhiteSpace(appSettingsFileName))
        {

            IConfigurationBuilder configBuilder = new ConfigurationBuilder().AddJsonFile(appSettingsFileName, false, true);
            IConfigurationRoot configRoot = configBuilder.Build();

            if (configRoot != null && !string.IsNullOrWhiteSpace(configRoot[AppsetingIn]))
            {
                returnValue = configRoot[AppsetingIn];
            }
        }

        return returnValue;
    }
}
