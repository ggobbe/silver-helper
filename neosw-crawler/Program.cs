using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AngleSharp;
using AngleSharp.Dom;
using Newtonsoft.Json;

namespace ConsoleApplication
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var potions = GetPotionsId();
            string json = JsonConvert.SerializeObject(potions);
            Console.WriteLine(json);
        }

        private static IEnumerable<int> GetPotionsId()
        {
            var config = Configuration.Default.WithDefaultLoader();
            var address = "https://sw.neosw.be/?psw=list_potion&type=pv";
            var document = BrowsingContext.New(config).OpenAsync(address).Result;
            var cellSelector = "img[src^=\"img/sw/obj/obj\"]";

            var items = document.QuerySelectorAll(cellSelector);
            var images = items.Select(i => i.GetAttribute("src"));

            var pattern = new Regex(@"img\/sw\/obj\/obj(?<id>\d+).(?:png|gif|jpg)");
            
            foreach(var image in images){
                var match = pattern.Match(image);
                var id = match.Groups["id"];
                
                var result = 0;
                if(!int.TryParse(id.Value, out result)){
                    throw new InvalidCastException($"Id could not be parsed in URL: " + image);
                }
                yield return int.Parse(id.Value);
            }
        }

        // string text = "ImageDimension=655x0;ThumbnailDimension=0x0";
        // Regex pattern = new Regex(@"ImageDimension=(?<imageWidth>\d+)x(?<imageHeight>\d+);ThumbnailDimension=(?<thumbWidth>\d+)x(?<thumbHeight>\d+)");
        // Match match = pattern.Match(text);
        // int imageWidth = int.Parse(match.Groups["imageWidth"].Value);
        // int imageHeight = int.Parse(match.Groups["imageHeight"].Value);
        // int thumbWidth = int.Parse(match.Groups["thumbWidth"].Value);
        // int thumbHeight = int.Parse(match.Groups["thumbHeight"].Value);
    }
}
