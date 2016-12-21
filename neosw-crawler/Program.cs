using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using AngleSharp;
using Newtonsoft.Json;

namespace ConsoleApplication
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var lifePotions = ExtractItemsIdFromUrl("https://sw.neosw.be/?psw=list_potion&type=pv&vente=1");
            var manaPotions = ExtractItemsIdFromUrl("https://sw.neosw.be/?psw=list_potion&type=mana&vente=1");
            var constitutionBoosts = ExtractItemsIdFromUrl("https://sw.neosw.be/?psw=list_potion&type=constitution&vente=1");
            var forceBoosts = ExtractItemsIdFromUrl("https://sw.neosw.be/?psw=list_potion&type=force&vente=1");
            var agiliteBoosts = ExtractItemsIdFromUrl("https://sw.neosw.be/?psw=list_potion&type=agilite&vente=1");
            var intelligenceBoosts = ExtractItemsIdFromUrl("https://sw.neosw.be/?psw=list_potion&type=intelligence&vente=1");

            var items = new
            {
                Potions = lifePotions.Concat(manaPotions),
                Boosts = constitutionBoosts.Concat(forceBoosts).Concat(agiliteBoosts).Concat(intelligenceBoosts)
            };

            string json = JsonConvert.SerializeObject(items);
            Console.WriteLine(json);
        }

        private static IEnumerable<int> ExtractItemsIdFromUrl(string url)
        {
            var config = Configuration.Default.WithDefaultLoader();
            var document = BrowsingContext.New(config).OpenAsync(url).Result;
            var imgSelector = "img[src^=\"img/sw/obj/obj\"]";

            var images = document.QuerySelectorAll(imgSelector);
            var imagesSrc = images.Select(i => i.GetAttribute("src"));

            var idPattern = new Regex(@"img\/sw\/obj\/obj(?<id>\d+).(?:png|gif|jpg)");

            foreach (var src in imagesSrc)
            {
                var match = idPattern.Match(src);
                var id = match.Groups["id"];

                var result = 0;
                if (!int.TryParse(id.Value, out result))
                {
                    throw new InvalidCastException($"Id could not be parsed in URL: " + src);
                }
                yield return int.Parse(id.Value);
            }
        }
    }
}
