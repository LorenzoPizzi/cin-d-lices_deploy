import {
    sequelize,
    User,
    Role,
    Movie,
    Recipe,
    Category,
    RecipeCategory,
} from "../models/index.js";
import { scrypt } from "../utils/scrypt.js";
import { getMediaById } from "../services/tmdbService.js";
import { name } from "ejs";

async function seedTables() {
    try {
        const now = new Date();

        // 1. Création des rôles
        const adminRole = await Role.create({
            roleName: "admin",
        });
        const userRole = await Role.create({
            roleName: "user",
        });

        // 2. Création des utilisateurs
        const adminPassword = "adminpassword";
        const adminHashedPassword = scrypt.hash(adminPassword);
        const john = await User.create({
            nickname: "JohnDoe",
            email: "john.doe@example.com",
            password: adminHashedPassword,
            picture_url:
                "https://i.pinimg.com/originals/54/72/d1/5472d1b09d3d724228109d381d617326.jpg",
            description: "test",
            token: null,
            email_verified: true,
            id_role: adminRole.id_role,
        });
        const userPassword = "userpassword";
        const userHashedPassword = scrypt.hash(userPassword);
        const jane = await User.create({
            nickname: "JaneSmith",
            email: "jane.smith@example.com",
            password: userHashedPassword,
            picture_url: null,
            description: "J'aime la cuisine et les films",
            token: null,
            email_verified: true,
            id_role: userRole.id_role,
        });

        // 3. Création des films
        const pulpfictionData = await getMediaById(680);

        const harryData = await getMediaById(671);
        console.log("Données TMDB récupérées pour Harry :", harryData);

        const ratatouilleFilmData = await getMediaById(2062)
        const saucebolognaiseData = await getMediaById(238)
        const carbonnadeData = await getMediaById(8265)
        const applepieData = await getMediaById(2105)
        const lasagneData = await getMediaById(8920)
        const spaghettidelmareData = await getMediaById(175);
        const lasoupeauxchouxData = await getMediaById(9317)
        



        const harry = await Movie.create({
            title: harryData.title,
            tmdb_id: harryData.id,
            type: harryData.type,
        })

        const pulpfiction = await Movie.create({
            title: pulpfictionData.title,
            tmdb_id: pulpfictionData.id,
            type: pulpfictionData.type,
        });

        const americanpie = await Movie.create({
            title: applepieData.title,
            tmdb_id: applepieData.id,
            type: applepieData.type,
        });

        const ratatouilleFilm = await Movie.create({
            title: ratatouilleFilmData.title,
            tmdb_id: ratatouilleFilmData.id,
            type: ratatouilleFilmData.type,
        });

        const saucebolognaiseFilm = await Movie.create({
            title: saucebolognaiseData.title,
            tmdb_id: saucebolognaiseData.id,
            type: saucebolognaiseData.type,
        });

    

        const carbonnadeFilm= await Movie.create({
            title: carbonnadeData.title,
            tmdb_id: carbonnadeData.id,
            type: carbonnadeData.type,
        });

        const lasagneFilm= await Movie.create({
            title: lasagneData.title,
            tmdb_id: lasagneData.id,
            type: lasagneData.type,
        });
        const spaghettidelmareFilm= await Movie.create({
            title: spaghettidelmareData.title,
            tmdb_id: spaghettidelmareData.id,
            type: spaghettidelmareData.type,
        });
        const lasoupeauxchouxFilm= await Movie.create({
            title: lasoupeauxchouxData.title,
            tmdb_id: lasoupeauxchouxData.id,
            type: lasoupeauxchouxData.type,
        });



        // 4. Création des catégories
        const entree = await Category.create({ name: "entrée" });
        const plat = await Category.create({ name: "plat" });
        const dessert = await Category.create({ name: "dessert" });
        const boisson = await Category.create({ name: "boisson"});

        // 5. Création des recettes
        const burgerBigKahuna = await Recipe.create({
            name: "Le Big Kahuna Burger",
            instructions: "Préchauffez le four à 160°C.\n Placez les rondelles d’ananas dans une assiette creuse avec la sauce Teriyaki. Laissez mariner 20 minutes. Pendant ce temps, lavez les tomates et découpez 8 tranches régulières, pas trop fines. Ouvrez les pains à burger. Placez-les sur une plaque de four, mie vers le haut, et déposez une tranche de fromage sur chaque moitié inférieure. Enfournez pour 10 minutes. Dans une poêle antiadhésive, faites cuire les steaks et les rondelles d’ananas à feu moyen, avec la sauce, selon vos goûts. Sortez les pains à burger, le fromage doit être fondu. Déposez sur le fromage un steak, une tranche d’ananas, une ou deux tranches de tomate selon leur taille puis une feuille de salade. Refermez le burger. S’il n’est pas assez chaud, enfournez 5 minutes de plus.",
            ingredients: "2 steaks hachés, 4 tranches d'ananas, 4 tranches de cheddar, 4 feuilles de salade, 4 cuillère à soupe de sauce teriyaki, 2 tomates",
            image_url:
                "https://images.unsplash.com/photo-1544719437-6347fe38444d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyJTIwYW5hbmFzfGVufDB8fDB8fHww",
            id_user: john.id_user,
            id_movie: pulpfiction.id_movie,
        });
        const applepie = await Recipe.create({
            name: "Apple pie",
            instructions: "Préparez la pâte. Coupez le beurre ramolli en dés. Dans un saladier, versez la farine et creusez-y un puits. Versez-y le beurre, le sel et le bicarbonate. Pétrissez grossièrement, puis incorporez progressivement l’eau. Pétrissez à nouveau jusqu’à former une boule. Couvrez le saladier et laissez reposer 30 min au frais. Préchauffez le four th.6 (180°C). Épluchez et épépinez les pommes, puis coupez-les en morceaux. Arrosez-les du jus du citron jaune dans un saladier, ajoutez la cannelle et mélangez pour enrober les pommes. Sortez la pâte et étalez-la sur un plan de travail fariné, assez pour y découper deux disques plus grands que votre moule. Placez le premier au fond du moule. Tapissez-le de morceaux de pommes. Recouvrez avec le second disque de pâte. Scellez les bords en pinçant avec les doigts, puis découpez des incisions en étoile sur le dessus, afin que la vapeur s’échappe. Saupoudrez de cassonade et enfournez pour 55 min. ",
            ingredients: "300g de farine, 190g de beurre mou, 5 cl d'eau, 0,5g cuillère à café, 1 pincée de sel",
            image_url:
                "https://plus.unsplash.com/premium_photo-1694336203192-c9e7f2891b95?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXBwbGUlMjBwaWV8ZW58MHx8MHx8fDA%3D",
            id_user: jane.id_user,
            id_movie: americanpie.id_movie,
        });

        const biereaubeurre = await Recipe.create({
            name:"Bière au beurre",
            instructions: "Faire dondre du beurre à feu très doux. Puis ajouter le sucre roux au beurre et le mélanger jusqu’à sa dissolution. Pour les amateurs d’épices, c’est le moment de les ajouter ! Faire attention aux grumeaux : mélanger vigoureusement sans s’arrêter pour les éviter. Dans un autre récipient, porter à ébullition la bière sans alcool  et l’ajouter directement au mélange beurre-sucre-épices. Enfin, verser la préparation dans des chopes et terminer avec la crème chantilly (à défaut, mélanger la crème liquide et le sucre avant de les battre pour obtenir une crème chantilly onctueuse). ",
            ingredients: "Beurre, eau, levure, sucre roux, clou de girofle",
            image_url:
                "https://images.unsplash.com/photo-1692188840299-a9f2f00d4ecc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmklQzMlQThyZSUyMGF1JTIwYmV1cnJlfGVufDB8fDB8fHww",
            id_user: jane.id_user,
            id_movie: harry.id_movie,
        })

        const ratatouille = await Recipe.create({
            name:"Ratatouille",
            instructions: "Pelez et hachez l'ail et l'oignon. Faites chauffer l'huile d'olive à feu moyen dans un faitout et faites-y revenir l'oignon. Lavez l’aubergine et la courgette, puis détaillez-les en tranches fines et régulières sans les éplucher. S’il vous reste des morceaux non réguliers, ajoutez-les à l’oignon dans le faitout. Procédez de même avec 3 tomates. Coupez la 4ème en dés et ajoutez-la au faitout. Lavez les poivrons, coupez le chapeau et détaillez-les en tranches régulières, en retirant pépins et chair blanche au passage. Versez les ratés dans le faitout. Mélangez le contenu du faitout, ajoutez l’eau et laisse mijoter 15 min à feu moyen. Ajoutez l’origan, le sel, le poivre et l’ail, puis mixez. Mélangez et poursuivez la cuisson 5 minutes. Etalez la sauce ainsi obtenue sur le fond d’un plat à gratin rond. Préchauffez le four à 180°C. Alternez les rondelles de légumes en cercle dans le plat à gratin jusqu’à épuisement, salez, poivrez et saupoudrez d’herbes de Provence. Enfournez pour 1 heure.",
            ingredients: "4 tomates, 1 poivron jaune, 1 poivron rouge, 1 aubergine, 1 courgette, 1 oignon, 1 gousse d'ail",
            image_url:
                "https://plus.unsplash.com/premium_photo-1713635953194-ab8a625b2477?q=80&w=1205&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            id_user: jane.id_user,
            id_movie: ratatouilleFilm.id_movie,
        })

        const saucebolognaise = await Recipe.create({
            name:"Sauce bolognaise ",
            instructions: "Faites griller les saucisses italiennes et les boulettes de viande à la poêle, 10 minutes environ. Découpez les saucisses en rondelles. Réservez au chaud. Pelez l’ail et hachez-le. Dans une casserole à feu moyen, faites chauffer l’huile d’olive. Ajoutez l’ail et faites-le revenir quelques minutes, sans le laisser griller. Ajoutez les tomates et le concentré. Laissez mijoter 5 minutes en remuant. Ajoutez les saucisses et les boulettes de viande, le vin puis le sucre. Réduisez le feu et laissez mijoter 20 minutes, en remuant de temps en temps. Servez chaud ou stockez en bocal stérilisé.",
            ingredients: "4 saucisses, 500g de boulettes de viande, 300g tomates pelée, 60g de sucre, 3 gousses d'ail",
            image_url:
                "https://images.unsplash.com/photo-1715733593146-93c3461765b8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            id_user: jane.id_user,
            id_movie: saucebolognaiseFilm.id_movie,
        })

        const tartemelasse = await Recipe.create({
            name:"Tarte à la mélasse",
            instructions: "Fouettez l’œuf avec la mélasse, le lait, la farine et le sucre. Déroulez la pâte brisée. Tapissez-en un moule à tarte chemisé de papier de cuisson, puis découpez les bords qui dépassent. Versez le mélange à la mélasse sur le fond de tarte. Avec la pâte restante, réalisez de fines bandes et déposez-les en croisillons sur la tarte. Enfournez pour 35 à 40 minutes, dans la partie basse du four. ",
            ingredients: "1 pâte brisée, 300g mélasse, 185g de lait, 160g de sucre, 1 oeuf, 1 cuillère à soupe de farine",
            image_url:
                "https://images.unsplash.com/photo-1576464244768-aa683350ecbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFydGUlMjAlQzMlQTAlMjBsYSUyMG0lQzMlQTlsYXNzZXxlbnwwfHwwfHx8MA%3D%3D",
            id_user: jane.id_user,
            id_movie: harry.id_movie,
        })

        const carbonnade = await Recipe.create({
            name:"Carbonnade flammande",
            instructions: "Découpez la viande en gros cubes. Pelez les oignons et émincez-les en rondelles. Dans une grande cocotte, faites fondre le beurre à feu moyen. Faites dorer les cubes de viande, puis retirez et réservez. Ajoutez les oignons et faites-les revenir quelques minutes, jusqu’à ce qu’ils soient dorés. Ajoutez le sucre roux. Mélangez et laissez mijoter 5 minutes, en remuant. Ajoutez le vinaigre et la viande, puis la farine. Salez, poivrez. Ajoutez la bière. Le liquide doit recouvrir la viande, complétez avec de l’eau si besoin. Ajoutez le thym, le laurier, les clous de girofle et laissez mijoter à feu moyen 15 minutes, sans couvrir. Tartinez les tranches de pain d’épices de moutarde et ajoutez dans la cocotte. Couvrez, baissez à feu doux et laisse mijoter 3 heures. Servez bien chaud avec des frites ! ",
            ingredients: "1.5kg viande de boeuf, 25g de beurre, 6 oignons, 5 tranches de pain d'épices, 3 cuillère à soupe de farine, 1L de bière blonde, 3 cuillère à soupe de sucre roux",
            image_url:
                "https://img.cuisineaz.com/660x495/2015/04/24/i1643-la-carbonnade-flamande-de-bienvenue-chez-les-ch-tis.webp",
            id_user: jane.id_user,
            id_movie: carbonnadeFilm.id_movie,
        })

        const lasagne = await Recipe.create({
            name:"Lasagne",
            instructions: "Préchauffez le four à 200°C. Pelez et émincez finement l’oignon. Faites chauffer l’huile d’olive dans une poêle antiadhésive, puis ajoutez l’oignon. Faites revenir à feu moyen jusqu’à ce qu’il soit translucide. Ajoutez la viande hachée émiettée et les herbes de Provence. Laissez mijoter 10 minutes, jusqu’à ce que la viande soit cuite. Dans un plat à gratin, versez le lait. Tapissez de 2 feuilles de lasagnes, recouvrez de sauce provençale, d’une couche de viande et de crème. Recouvrez de lasagnes et répétez les mêmes opérations deux fois. Terminez par des feuilles de lasagnes. Répartissez ce qu’il vous reste de sauce et de crème sur les dernières feuilles, saupoudrez de gruyère, de parmesan et déposez une noisette de beurre. Enfournez pour 20 minutes. Les feuilles de lasagnes doivent être fondantes.  ",
            ingredients: "Feuille de lasagne, 600g de sauce provençale, 500g de viande hachée, 50g de gruyère râpé, 25cl de crème liquide, 1 oignon, 4 cuillère à soupe de lait, 1 beurre",
            image_url:
                "https://images.unsplash.com/photo-1597289124948-688c1a35cb48?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxhc2FnbmV8ZW58MHx8MHx8fDA%3D",
            id_user: jane.id_user,
            id_movie: lasagneFilm.id_movie,
        })

        const spaghettidelmare = await Recipe.create({
            name:"Les spaghetti del mare",
            instructions: "Pelez l’ail et émincez-le finement. Dans une casserole, faites revenir l’ail dans 2 cuillères d’huile d’olive. Ajoutez le vin blanc juste avant coloration de l’ail. Ajoutez le mélange de fruits de mer, baissez le feu et laissez mijoter 10 minutes à feu moyen. Dans une cocotte, diluez le court-bouillon dans 1 litre d’eau. Portez à ébullition et ajoutez les langoustines et les coquillages. Laissez frémir 3 minutes. Egouttez et décortiquez les langoustines en conservant la queue. Changez l’eau de la cocotte et faites cuire les spaghettis al dente, selon les instructions du paquet. Egouttez les spaghettis et servez par assiette. Arrosez du reste d’huile d’olive, mélangez avec une portion de mélange de fruits de mer à l’ail. " ,
            ingredients: "500g de spaghettis, 250g de fruits de mer, 250g de praire, 20cl de vin blanc, 8 langoustines, 2 gousses d'ail, 6 cuillèreà soupe d'huile d'olive, 1 court-bouillon pour poisson",
            image_url:
                "https://plus.unsplash.com/premium_photo-1661445014453-784cd6c59ac8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3BhZ2hldHRpJTIwZnJ1aXQlMjBkZSUyMG1lcnxlbnwwfHwwfHx8MA%3D%3D",
            id_user: jane.id_user,
            id_movie: spaghettidelmareFilm.id_movie,
        })

        const lasoupeauxchoux = await Recipe.create({
            name:"La soupe aux choux",
            instructions: "Lavez le poireau et coupez-le en rondelles. Epluchez la carotte et détaillez-la en morceaux. Lavez le chou, détachez les feuilles. Epluchez les pommes de terre et coupez-les en cubes. Dans une cocotte, faites fondre le beurre à feu doux. Ajoutez le poireau, les carottes, la rave et les pommes de terre. Salez, poivrez. Dans une cocotte, faites fondre le beurre à feu doux. Ajoutez le poireau, les carottes, la rave et les pommes de terre. Salez, poivrez. Laissez mijoter 1 heure à feu doux et servez." ,
            ingredients: "500g de poitrine fumée, 4 pommes de terre, 2 carrottes, 1 chou vert, 1 poireau",
            image_url:
                "https://images.unsplash.com/photo-1612108438004-257c47560118?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fHNvdXBlJTIwYXV4JTIwY2hvdXh8ZW58MHx8MHx8fDA%3D",
            id_user: jane.id_user,
            id_movie: lasoupeauxchouxFilm.id_movie,
        })

        // 6. Table de liaison RECIPE_CATEGORY
        await RecipeCategory.create({
            id_recipe: ratatouille.id_recipe,
            id_category: plat.id_category,
        });
        await RecipeCategory.create({
            id_recipe: biereaubeurre.id_recipe,
            id_category: boisson.id_category,
        });
        await RecipeCategory.create({
            id_recipe: saucebolognaise.id_recipe,
            id_category: plat.id_category,
        });
        await RecipeCategory.create({
            id_recipe: tartemelasse.id_recipe,
            id_category: dessert.id_category,
        });
        await RecipeCategory.create({
            id_recipe: carbonnade.id_recipe,
            id_category: plat.id_category,
        });
        await RecipeCategory.create({
            id_recipe: burgerBigKahuna.id_recipe,
            id_category: plat.id_category,
        });
        await RecipeCategory.create({
            id_recipe: applepie.id_recipe,
            id_category: plat.id_category,
        });
        await RecipeCategory.create({
            id_recipe: lasagne.id_recipe,
            id_category: plat.id_category,
        });
        await RecipeCategory.create({
            id_recipe: spaghettidelmare.id_recipe,
            id_category: plat.id_category,
        });
        await RecipeCategory.create({
            id_recipe: lasoupeauxchoux.id_recipe,
            id_category: plat.id_category,
        });
        
        

        console.log("Seed terminé !");
    } catch (error) {
        console.error("Erreur lors du seed :", error);
    } finally {
        await sequelize.close();
    }
}

seedTables();
